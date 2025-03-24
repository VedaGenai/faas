"use client";
import { useState, useEffect } from "react";
import RoleSelector from "./RoleSelector";
import React from 'react';

const Sidebar = ({
    roles,
    skills_data,
    samplePrompts,
    sendRangeValue,
    onCreate,
    sendSelectedRoles,
    onRoleSelect,
    onDashboardUpdate
}) => {
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [rangeValue, setRangeValue] = useState(1);
    const [message, setMessage] = useState("");
    const [customPrompt, setCustomPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [promptsList, setPromptsList] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        console.log("Sample prompts received:", samplePrompts);
        
        if (samplePrompts) {
          let processedPrompts = [];
          
          if (Array.isArray(samplePrompts)) {
            processedPrompts = samplePrompts;
          } 
          else if (typeof samplePrompts === 'string' && samplePrompts.includes('\n')) {
            processedPrompts = samplePrompts.split('\n').filter(p => p.trim());
          }
          else if (typeof samplePrompts === 'string' && samplePrompts.includes('.')) {
            processedPrompts = samplePrompts.split(/\.(?=\s|$)/).filter(p => p.trim()).map(p => p + '.');
          }
          else if (typeof samplePrompts === 'string') {
            processedPrompts = [samplePrompts];
          }
          
          console.log("Processed prompts:", processedPrompts);
          setPromptsList(processedPrompts);
        } else {
          setPromptsList([]);
        }
      }, [samplePrompts]);      

    useEffect(() => {
        console.log("Roles received in sidebar:", roles);
        if (roles && roles.length > 0) {
            setSelectedRoles([]);
        }
    }, [roles]);

    useEffect(() => {
        if (selectedRoles.length > 0) {
            sendSelectedRoles(selectedRoles);
        }
    }, [selectedRoles, sendSelectedRoles]);

    const handleRangeChange = (e) => {
        setRangeValue(e.target.value);
        sendRangeValue(e.target.value);
    };

    const handleRoleChange = (role) => {
        const updatedRoles = selectedRoles.includes(role)
            ? selectedRoles.filter(r => r !== role)
            : [...selectedRoles, role];
        setSelectedRoles(updatedRoles);
        onRoleSelect(updatedRoles);
    };
  const handleRunPrompt = async (prompt) => {
    try {
      setIsLoading(true);
      setError(null);
    
      console.log("Running prompt:", prompt);
    
      const promptText = typeof prompt === 'string' ? prompt : String(prompt || "");
    
      const response = await fetch('/api/process-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process prompt');
      }
    
      const data = await response.json();
      console.log("Prompt response:", data);
    
      const updatedSkillsData = manuallyApplyChanges(skills_data, promptText);
    
      if (onDashboardUpdate) {
        onDashboardUpdate(updatedSkillsData);
      }
    
      alert("Threshold scores updated successfully!");
    
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing prompt:", error);
      setError(`Error updating dashboard: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Function to manually apply changes based on the prompt text
  const manuallyApplyChanges = (currentSkillsData, promptText) => {
    // Deep clone the current skills data to avoid mutating the original
    const updatedSkillsData = JSON.parse(JSON.stringify(currentSkillsData));
  
    // Parse the prompt text to extract changes
    // Example patterns to match:
    // 1. Set Natural Language Processing (NLP)'s selection score from 60.0% to 70.0%
    // 2. Update Pipeline Development's rating from 10.0 to 10.0
    // 3. Adjust Apply GenAI models's rejection score from 20.0% to 30.0%
    // 4. Change Pipeline Development's importance from 25.0% to 30.0%
  
    const lines = promptText.split('\n');
  
    for (const line of lines) {
      if (!line.trim()) continue;
    
      // Extract skill name and values
      let skillName = '';
      let newValue = 0;
      let isRating = false;
    
      // Check for different patterns
      if (line.includes("selection score") || line.includes("rejection score")) {
        // Extract skill name - it's between the start and "'s"
        const match = line.match(/(?:Set|Adjust)\s+(.*?)'s/);
        if (match && match[1]) {
          skillName = match[1];
        }
      
        // Extract new value - it's after "to" and before "%"
        const valueMatch = line.match(/to\s+(\d+\.\d+)%/);
        if (valueMatch && valueMatch[1]) {
          newValue = parseFloat(valueMatch[1]);
        }
      
        isRating = false; // This is an importance value
      } 
      else if (line.includes("rating")) {
        // Extract skill name
        const match = line.match(/Update\s+(.*?)'s/);
        if (match && match[1]) {
          skillName = match[1];
        }
      
        // Extract new value
        const valueMatch = line.match(/to\s+(\d+\.\d+)/);
        if (valueMatch && valueMatch[1]) {
          newValue = parseFloat(valueMatch[1]);
        }
      
        isRating = true; // This is a rating value
      }
      else if (line.includes("importance")) {
        // Extract skill name
        const match = line.match(/Change\s+(.*?)'s/);
        if (match && match[1]) {
          skillName = match[1];
        }
      
        // Extract new value
        const valueMatch = line.match(/to\s+(\d+\.\d+)%/);
        if (valueMatch && valueMatch[1]) {
          newValue = parseFloat(valueMatch[1]);
        }
      
        isRating = false; // This is an importance value
      }
    
      // If we found a skill name and a new value, update the skills data
      if (skillName && newValue) {
        console.log(`Updating ${skillName} with new ${isRating ? 'rating' : 'importance'} value: ${newValue}`);
      
        // Find the skill in the skills data
        const roleKey = Object.keys(updatedSkillsData)[0]; // Assuming there's only one role
        if (!roleKey) continue;
      
        const roleData = updatedSkillsData[roleKey];
        let found = false;
      
        // Check in skills, achievements, and activities
        for (const category of ['skills', 'achievements', 'activities']) {
          if (roleData[category] && roleData[category][skillName]) {
            // Found the skill, update the value
            if (isRating) {
              roleData[category][skillName].rating = newValue;
            } else {
              roleData[category][skillName].importance = newValue;
            }
            found = true;
            break;
          }
        }
      
        if (!found) {
          console.warn(`Could not find skill: ${skillName} in the skills data`);
        }
      }
    }
  
    return updatedSkillsData;
  };
    const handleCreate = () => {
        if (selectedRoles.length > 0) {
            console.log("Creating dashboard with roles:", selectedRoles);
            // Pass both roles and skills data
            sendSelectedRoles(selectedRoles);
            sendRangeValue(rangeValue);
            onCreate({
                roles: selectedRoles,
                skills_data: skills_data
            });
            setMessage("Created dashboard for selected roles");
        }
    };
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="mb-6 border rounded-lg p-4">
                <RoleSelector
                    roles={roles} 
                    onRoleChange={handleRoleChange}
                    selectedRoles={selectedRoles}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Dashboards: {rangeValue}
                </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={rangeValue}
                    onChange={handleRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <button
                onClick={handleCreate}
                className="w-full mb-6 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                disabled={selectedRoles.length === 0}
            >
                Create Dashboard 
            </button>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Prompt
                </label>
                <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your custom prompt here..."
                    rows="4"
                />
                <button
                    onClick={handleRunPrompt}
                    disabled={isLoading}
                    className="w-full mt-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                    {isLoading ? "Processing..." : "Run Prompt"}
                </button>
                {response && (
                    <div className={`mt-2 p-2 rounded-md ${
                        response.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                        {response}
                    </div>
                )}
            </div>
                {/* Sample Prompts Section */}
                {promptsList && promptsList.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Sample Prompts</h3>
                    <div className="space-y-3">
                      {promptsList.map((prompt, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700">{prompt}</p>
                          <div className="mt-2 flex space-x-2">
                            <button
                              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                              onClick={() => handleRunPrompt(prompt)}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Running...' : 'Run Prompt'}
                            </button>
                            <button
                              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                              onClick={() => {
                                navigator.clipboard.writeText(prompt);
                                alert('Prompt copied to clipboard!');
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </div>


                      ))}
                    </div>
                  </div>

                )}
              
                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
            </div>
    );
};

export default Sidebar;
