
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import RightSidebar from './rightsidebar';
import Link from 'next/link';
import { FaCheckCircle, FaHourglassHalf, FaUserTie } from 'react-icons/fa';

// Sample Prompts Component
const SamplePrompts = ({ prompts }) => {
  if (!prompts ||!Array.isArray(prompts) || prompts.length === 0) {
    return null;
  }

  
};

// Placeholder components for the dashboard items
const ThresholdScore = ({ onMinimize }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      /<h3 className="text-lg font-semibold">Threshold Score</h3>
      <button onClick={onMinimize} className="text-gray-500 hover:text-gray-700">Minimize</button>
    </div>
    <div>Threshold Score Content</div>
  </div>
);

const JobDescription = ({ onMinimize }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Job Description</h3>
      <button onClick={onMinimize} className="text-gray-500 hover:text-gray-700">Minimize</button>
    </div>
    <div>Job Description Content</div>
  </div>
);

const Resume = ({ onMinimize }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Resume</h3>
      <button onClick={onMinimize} className="text-gray-500 hover:text-gray-700">Minimize</button>
    </div>
    <div>Resume Content</div>
  </div>
);

const CommunicationSkills = ({ onMinimize }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Communication Skills</h3>
      <button onClick={onMinimize} className="text-gray-500 hover:text-gray-700">Minimize</button>
    </div>
    <div>Communication Skills Content</div>
  </div>
);

const Coding = ({ onMinimize }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Coding</h3>
      <button onClick={onMinimize} className="text-gray-500 hover:text-gray-700">Minimize</button>
    </div>
    <div>Coding Content</div>
  </div>
);

const BehaviouralSkills = ({ onMinimize }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Behavioural Skills</h3>
      <button onClick={onMinimize} className="text-gray-500 hover:text-gray-700">Minimize</button>
    </div>
    <div>Behavioural Skills Content</div>
  </div>
);

const CommonDashboard = ({ onMinimize }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Common Dashboard</h3>
      <button onClick={onMinimize} className="text-gray-500 hover:text-gray-700">Minimize</button>
    </div>
    <div>Common Dashboard Content</div>
  </div>
);

const HRSystem = ({ onMinimize }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">HR System</h3>
      <button onClick={onMinimize} className="text-gray-500 hover:text-gray-700">Minimize</button>
    </div>
    <div>HR System Content</div>
  </div>
);

export default function Threshold({ jdData = {} }) {
  // Debug the incoming jdData
  console.log('Threshold component received jdData:', jdData);
  console.log('Sample prompts received in Threshold:', jdData?.apiResponse?.selected_prompts);

  const [roles, setRoles] = useState(() => {
    const rolesData = jdData?.apiResponse?.roles;
    console.log("Initializing roles with:", rolesData);
    return rolesData || [];
  });

  const [skillsData, setSkillsData] = useState(() => {
    const skillsData = jdData?.apiResponse?.skills_data || [];
    return [Array.isArray(skillsData) ? skillsData : [skillsData]];
  });

  // Initialize sample prompts from the API response
  const [samplePrompts, setSamplePrompts] = useState(() => {
    const prompts = jdData?.apiResponse?.selected_prompts;
    console.log('Initializing sample prompts with:', prompts);  
    // Check if prompts is an array
    if (Array.isArray(prompts) && prompts.length > 0) {
      return prompts;
    }
    
    // Generate default prompts
    const role = jdData?.apiResponse?.roles?.[0] || "the role";
    const skills = Object.keys(jdData?.apiResponse?.skills_data || {}).slice(0, 5).join(", ");


    
    // // If prompts don't exist or are empty, generate default ones
    // if (!prompts || prompts.length === 0) {
    //   const role = jdData?.apiResponse?.roles?.[0] || "the role";
    //   const skills = Object.keys(jdData?.apiResponse?.skills_data || {}).slice(0, 5).join(", ");
      
      return [
        `I am applying for ${role} position. Here's my resume: [PASTE RESUME]. How well do I match the requirements?`,
        `I have experience in ${skills}. Can you help me tailor my resume for the ${role} position?`,
        `What specific achievements should I highlight in my cover letter for the ${role} position?`,
        `Based on the job description for ${role}, what questions might I be asked in an interview?`,
        `How can I demonstrate my expertise in ${skills} during an interview for the ${role} position?`
      ];
    });
    

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [showThreshold, setShowThreshold] = useState(true);
  const [showJobDescription, setShowJobDescription] = useState(true);
  const [showResume, setShowResume] = useState(true);
  const [showCommunicationSkills, setShowCommunicationSkills] = useState(true);
  const [showCoding, setShowCoding] = useState(true);
  const [showBehaviouralSkills, setShowBehaviouralSkills] = useState(true);
  const [showCommondashBoard, setShowCommondashBoard] = useState(true);
  const [showHrSystem, setShowHrSystem] = useState(true);
  const [ViewItems, setViewItems] = useState([]);
  const [showProjectdashboard, setShowDashboard] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const [timelineData, setTimelineData] = useState([
    {
      id: 1,
      candidate: "John Doe",
      stages: [
        { stage: "Applied", date: "2024-01-15", status: "completed" },
        { stage: "Screening", date: "2024-01-16", status: "completed" },
        { stage: "Technical", date: "2024-01-18", status: "current" },
        { stage: "HR Round", date: "", status: "pending" },
        { stage: "Offer", date: "", status: "pending" }
      ]
    },
  ]);

  const [thresholdScores, setThresholdScores] = useState({
    selection: 0,
    rejection: 0
  });

  const [sharedValue, setSharedValue] = useState(null);
  const [selectedRolesForThreshold, setSelectedRolesForThreshold] = useState([]);

  useEffect(() => {
  if (jdData?.apiResponse) {
    setRoles(jdData.apiResponse.roles || []);
    setSkillsData([Array.isArray(jdData.apiResponse.skills_data)
      ? jdData.apiResponse.skills_data
      : [jdData.apiResponse.skills_data || {}]]);
    
    // Make sure we're setting an array for sample prompts
    if (Array.isArray(jdData.apiResponse.selected_prompts)) {
      setSamplePrompts(jdData.apiResponse.selected_prompts);
    } else if (typeof jdData.apiResponse.selected_prompts === 'string') {
      // If it's a string, convert it to an array with one item
      setSamplePrompts([jdData.apiResponse.selected_prompts]);
    } else {
      // Generate default prompts
      const role = jdData.apiResponse.roles?.[0] || "the role";
      const skills = Object.keys(jdData.apiResponse.skills_data || {}).slice(0, 5).join(", ");
      
      setSamplePrompts([
        `I am applying for ${role} position. Here's my resume: [PASTE RESUME]. How well do I match the requirements?`,
        `I have experience in ${skills}. Can you help me tailor my resume for the ${role} position?`,
        `What specific achievements should I highlight in my cover letter for the ${role} position?`,
        `Based on the job description for ${role}, what questions might I be asked in an interview?`,
        `How can I demonstrate my expertise in ${skills} during an interview for the ${role} position?`
      ]);
    }
    
    console.log('Updated sample prompts from jdData:', jdData.apiResponse.selected_prompts);
  }
}, [jdData]);


  const handleSelectedRoles = (roles) => {
    // console.log("Page received selected roles:", roles);
    setSelectedRolesForThreshold(roles);
    // Show the dashboard when roles are selected
    setShowDashboard(true);
  };

  const handleSendRangeValue = (value) => {
    setSharedValue(value);
  };

  const handleRolesUpdate = (newRoles) => {
    console.log("Page received new roles from API:", newRoles);
    setRoles(newRoles);
  };

  const handleSkillsUpdate = (newSkills) => {
    console.log("Page received new skills from API:", newSkills);
    setSkillsData(newSkills);
  };

  const handleRoleSelection = (selectedRoles) => {
    setSelectedRoles(selectedRoles);
  };

  const handleDashboardUpdate = (newData) => {
    setSkillsData(newData);
    setShowDashboard(true);
    setIsSidebarOpen(true);
  };

  const getItems = () => {
    const items = [];

    if (showThreshold) {
      items.push({
        id: 'threshold',
        component: <ThresholdScore onMinimize={() => {
          setShowThreshold(false);
          setViewItems(["threshold", ...ViewItems]);
        }} />
      });
    }

    if (showJobDescription) {
      items.push({
        id: 'job-description',
        component: <JobDescription onMinimize={() => {
          setShowJobDescription(false);
          setViewItems(["job-description", ...ViewItems]);
        }} />
      });
    }

    if (showResume) {
      items.push({
        id: 'resume',
        component: <Resume onMinimize={() => {
          setShowResume(false);
          setViewItems(["resume", ...ViewItems]);
        }} />
      });
    }

    if (showCommunicationSkills) {
      items.push({
        id: 'communication-skills',
        component: <CommunicationSkills onMinimize={() => {
          setShowCommunicationSkills(false);
          setViewItems(["communication-skills", ...ViewItems]);
        }} />
      });
    }

    if (showCoding) {
      items.push({
        id: 'coding',
        component: <Coding onMinimize={() => {
          setShowCoding(false);
          setViewItems(["coding", ...ViewItems]);
        }} />
      });
    }

    if (showBehaviouralSkills) {
      items.push({
        id: 'Behavioural-skills',
        component: <BehaviouralSkills onMinimize={() => {
          setShowBehaviouralSkills(false);
          setViewItems(["Behavioural-skills", ...ViewItems]);
        }} />
      });
    }

    if (showCommondashBoard) {
      items.push({
        id: 'commondashboard',
        component: <CommonDashboard onMinimize={() => {
          setShowCommondashBoard(false);
          setViewItems(["commondashboard", ...ViewItems]);
        }} />
      });
    }

    if (showHrSystem) {
      items.push({
        id: 'HrSystem',
        component: <HRSystem onMinimize={() => {
          setShowHrSystem(false);
          setViewItems(["HrSystem", ...ViewItems]);
        }} />
      });
    }
    return items;
  };

  const handleShowThreshold = () => {
    setShowThreshold(true);
    const filtered = ViewItems.filter((item) => item !== "threshold");
    setViewItems(filtered);
  };

  const handleShowJobDescription = () => {
    setShowJobDescription(true);
    const filtered = ViewItems.filter((item) => item !== "job-description");
    setViewItems(filtered);
  };

  const handleShowResume = () => {
    setShowResume(true);
    const filtered = ViewItems.filter((item) => item !== "resume");
    setViewItems(filtered);
  };

  const handleShowCommunicationSkills = () => {
    setShowCommunicationSkills(true);
    const filtered = ViewItems.filter((item) => item !== "communication-skills");
    setViewItems(filtered);
  };

  const handleShowCoding = () => {
    setShowCoding(true);
    const filtered = ViewItems.filter((item) => item !== "coding");
    setViewItems(filtered);
  };

  const handleShowBehaviouralSkills = () => {
    setShowBehaviouralSkills(true);
    const filtered = ViewItems.filter((item) => item !== "Behavioural-skills");
    setViewItems(filtered);
  };

  const handleShowCommondashBoard = () => {
    setShowCommondashBoard(true);
    const filtered = ViewItems.filter((item) => item !== "commondashboard");
    setViewItems(filtered);
  };

  const handleShowHrSystem = () => {
    setShowHrSystem(true);
    const filtered = ViewItems.filter((item) => item !== "HrSystem");
    setViewItems(filtered);
  };

  const handleFileUploadSuccess = (data) => {
    console.log("File upload success with data:", data);
    setRoles(data.roles || []);
    setSkillsData(data.skills_data || {});
    setSamplePrompts(data.selected_prompts || "");
    console.log("Setting sample prompts to:", data.selected_prompts);
    setSelectedRolesForThreshold([]);
  };

  const handleCreate = () => {
    console.log("Creating dashboard with roles:", selectedRolesForThreshold);
    console.log("Skills data available:", skillsData);
    console.log("Sample prompts available:", samplePrompts);
    setShowDashboard(true);
    setIsSidebarOpen(false);
    // Pass complete data to RightSidebar
    if (showProjectdashboard) {
      return (
        <RightSidebar
          selectedRoles={selectedRolesForThreshold}
          skills_data={skillsData}
          rangeValue={sharedValue}
        />
      );
    }
  };

  return (
    // <div className="flex flex-col bg-indigo-50 overflow-hidden">
    //   <main className="flex flex-col w-full max-md:max-w-full">
    //     <div className="space-y-2 bg-white rounded-lg shadow-md mx-8 mt-2 p-2">
    //     </div>
    <div className="flex flex-col  overflow-hidden">
  <main className="flex flex-col w-full max-md:max-w-full">
    <div className="space-y-2 bg-white rounded-lg shadow-md p-0 mx-2 mt-5">
      {/* Content here */}
    </div>

      

        <div className="space-y-2 bg-white rounded-lg shadow-md  mt-2 pt-2">
          <section className="flex flex-col justify-center self-center p-0.5 mt- w-full bg-white max-w-[100%] max-md:max-w-full">
            <div className="flex flex-col w-full bg-white shadow-sm max-md:pb-24 max-md:max-w-full">
              <div className="flex relative">
                <div
                  className="fixed left-0 top-0 h-full w-4 z-50"
                  onMouseEnter={() => setIsSidebarOpen(true)}
                />

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'w-1/4' : 'w-0'
                  } overflow-hidden`}
                  onMouseLeave={() => showProjectdashboard && setIsSidebarOpen(false)}
                >
                  <div style={{display: isSidebarOpen ? 'block' :'none' }}>
                    <Sidebar
                      roles={roles}
                      skills_data={skillsData}
                      samplePrompts={samplePrompts}
                      onRoleSelect={handleRoleSelection}
                      onDashboardUpdate={handleDashboardUpdate}
                      sendRangeValue={handleSendRangeValue}
                      sendSelectedRoles={handleSelectedRoles}
                      onCreate={handleCreate}
                    />
                  </div>
                </div>

                <div style={{width:'100%',clear:'both'}}>
                  <span style={{paddingLeft:'26px',fontSize:'30px'}}> Threshold Score</span>
                  <Link style={{float:'right'}} href="/">
                    <button>
                      <img
                        loading="lazy"
                        src="../../close.svg"
                        style={{width:'14px',height:'14px',margin:'10px',padding:'0px'}}
                      />
                    </button>
                  </Link>

                  {showProjectdashboard && (
                    <div
                      className={`transition-all duration-300 ease-in-out flex-grow ${
                        isSidebarOpen ? 'ml-0' : 'ml-0 w-full'
                      }`}
                    >
                      <div className="w-full overflow-x-hidden" style={{height:'auto'}}>
                        <RightSidebar
                          selectedRoles={selectedRolesForThreshold || []}
                          skills_data={skillsData || {}}
                          closeSidebar={() => setIsSidebarOpen(false)}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Display Sample Prompts */}
                  {samplePrompts && samplePrompts.length > 0 && (
                    <SamplePrompts prompts={samplePrompts} />
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "100%",
    padding: "20px",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  },
  section: {
    marginTop: "0px",
  },
  subheading: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  list: {
    padding: "0",
    listStyle: "none",
  },
  listItem: {
    padding: "8px",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
    marginBottom: "5px",
  },
  chatBox: {
    height: "100px",
    overflowY: "auto",
    backgroundColor: "#f9f9f9",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  chatMessage: {
    backgroundColor: "#fff",
    padding: "5px",
    borderRadius: "5px",
    marginBottom: "3px",
  },
  input: {
    flex: "1",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  button: {
    marginLeft: "10px",
    padding: "8px 12px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  notifyButton: {
    padding: "8px 12px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  timeline: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
  },
  timelineEvent: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    borderBottom: '1px solid #eee',
  },
  auditLog: {
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  compliance: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  complianceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  timelineContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  candidateName: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userIcon: {
    color: '#2196F3',
  },
  timeline: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    padding: '20px 0',
  },
  timelineStage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    flex: 1,
  },
  stageConnector: {
    position: 'absolute',
    top: '25px',
    left: '-50%',
    right: '50%',
    height: '2px',
    backgroundColor: '#e0e0e0',
    zIndex: 1,
  },
  stageNode: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    transition: 'all 0.3s ease',
  },
  stageInfo: {
    textAlign: 'center',
    marginTop: '10px',
  },
  stageName: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
  },
  stageDate: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  }
};