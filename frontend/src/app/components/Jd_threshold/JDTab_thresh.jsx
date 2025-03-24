import React, { useState, useEffect } from 'react';
import { FaUpload, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';
import DrawerNavigationJD from './DrawerNavigation';
import CS from './page';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const JDTab = ({ jdList, setJdList, setSelectedJDForSidebar }) => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedJD, setSelectedJD] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDisplayId, setActiveDisplayId] = useState(null);
  const [displayStatus, setDisplayStatus] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [error, setError] = useState(null);
  const [extractedRoles, setExtractedRoles] = useState([]);
  const [extractedSkills, setExtractedSkills] = useState({});

  const recordsPerPage = 10;

  const buttonConfig = {
    'Upload JD': { icon: <FaUpload className="mr-2 text-blue-500" />, color: 'blue' },
  };

  const handleCreate = async (item) => {
    try {
      setLoading(true);
      setError(null);
  
      console.log('Creating dashboard with data:', {
        roles: item.fullData.roles,
        skills: item.fullData.skills_data
      });
  
      if (!item.fullData || !item.fullData.roles || !item.fullData.skills_data) {
        throw new Error('Missing required data for dashboard creation');
      }
  
      setExtractedRoles(item.fullData.roles);
      setExtractedSkills(item.fullData.skills_data);
  
      setDisplayStatus(prev => ({
        ...prev,
        [item.id]: 'modify'
      }));
  
      setActiveDisplayId(item.id);
  
      const updatedList = jdList.map(jd => {
        if (jd.id === item.id) {
          return {
            ...jd,
            threshold: 'View',
            status: 'Success',
            matchScore: item.fullData.selection_threshold?.toFixed(2) || jd.matchScore || 0,
            relevanceScore: item.fullData.rejection_threshold?.toFixed(2) || jd.relevanceScore || 0,
            apiResponse: {
              roles: item.fullData.roles,
              skills_data: item.fullData.skills_data,
              achievements: item.fullData.achievements,
              selected_prompts: item.fullData.selected_prompts
            }
          };
        }
        return jd;
      });
  
      setJdList(updatedList);
      setShowDashboard(true);
  
    } catch (error) {
      console.error('Error in handleCreate:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleFileUpload = (buttonType) => async (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      
      const validFileTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/json'
      ];

      if (validFileTypes.includes(file.type)) {
        setLoading(true);
        setError(null);
        
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await axios.post(
            `${API_URL}/analyze_job_description/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          //console.log("response from backend:", response);

          if (response.data && response.data.status === 'success') {
            console.log("API response:", response.data);
           
           // console.log("Selected prompts from API:", response.data.selected_prompts);
            
            const newFile = {
              id: Date.now() + Math.random(),
              role: response.data.roles[0],
              skills: response.data.skills_data,
              achievements: response.data.achievements,
              fileName: file.name,
              uploadDate: new Date().toLocaleDateString(),
              status: 'Success',
              threshold: 'View',
              matchScore: response.data.selection_threshold?.toFixed(2) || 0,
              relevanceScore: response.data.rejection_threshold?.toFixed(2) || 0,
              fullData: {
                ...response.data,
                selected_prompts: response.data.selected_prompts  // Explicitly include this
              },
              file: file
            };
            
            setJdList(prev => [...prev, newFile]);
            setShowDashboard(true);
          }else {
            throw new Error('Invalid API response');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          setError(error.message || 'Failed to upload and process the file');
          
          const newFile = {
            id: Date.now() + Math.random(),
            role: 'Error',
            position: 'N/A',
            fileName: file.name,
            uploadDate: new Date().toLocaleDateString(),
            status: 'Error',
            threshold: 'N/A',
            matchScore: 0,
            relevanceScore: 0,
            buttonType: buttonType,
            file: file,
          };
          
          setJdList(prev => [...prev, newFile]);
        } finally {
          setLoading(false);
        }
      } else {
        alert("Please upload only PDF, DOCX, TXT, or JSON files.");
      }
    }
  };

  const handleDelete = (id) => {
    const updatedList = jdList.filter(item => item.id !== id);
    setJdList(updatedList);
    if (activeDisplayId === id) setActiveDisplayId(null);
    setDisplayStatus(prev => {
      const newStatus = {...prev};
      delete newStatus[id];
      return newStatus;
    });
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  };
  const handleRowSelect = (id) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleModifyClick = (item) => {
    if (item.threshold === 'View' && item.status !== 'Error') {
      setSelectedJD(item);
      if (setSelectedJDForSidebar) {
        setSelectedJDForSidebar(item);
      }
      setIsDrawerOpen(true);
    }
  };

  const handleDisplayClick = (item) => {
    if (activeDisplayId === item.id) {
      setActiveDisplayId(null);
    } else {
      handleCreate(item);
    }
  };

  const handleCloseDisplay = (id) => {
    setActiveDisplayId(null);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedJD(null);
  };

  const totalPages = Math.ceil(jdList.length / recordsPerPage);
  const paginatedList = jdList.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const getDisplayButtonText = (itemId) => {
    if (activeDisplayId === itemId) {
      return 'Hide';
    }
    return displayStatus[itemId] || 'create';
  };
  const renderDashboard = () => (
    <div className="bg-white rounded-lg shadow-md p-4 mt-2">
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Processing...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selection Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejection Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedList.map((item) => (
              <React.Fragment key={item.id}>
                <tr className={selectedRows.has(item.id) ? 'bg-gray-100' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.uploadDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {item.matchScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {item.relevanceScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleModifyClick(item)}
                      className="text-blue-500 hover:underline"
                      disabled={item.threshold !== 'View' || item.status === 'Error'}
                    >
                      {item.threshold}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDisplayClick(item)}
                      className={`px-2 py-1 rounded ${activeDisplayId === item.id ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} hover:underline`}
                    >
                      {getDisplayButtonText(item.id)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-blue-500 hover:text-blue-700">View Full Details</summary>
                      <div className="mt-2 p-4 border rounded bg-gray-50">
                        <div className="mb-4">
                          <h4 className="font-bold text-gray-700">Skills:</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            {item.apiResponse?.skills_data && (
                              <pre className="whitespace-pre-wrap bg-white p-2 rounded">
                                {JSON.stringify(item.apiResponse.skills_data, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-bold text-gray-700">Achievements:</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            {item.apiResponse?.achievements && (
                              <pre className="whitespace-pre-wrap bg-white p-2 rounded">
                                {JSON.stringify(item.apiResponse.achievements, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
  
                        <div>
                          <h4 className="font-bold text-gray-700">Complete Response:</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            <pre className="whitespace-pre-wrap bg-white p-2 rounded">
                              {JSON.stringify(item.apiResponse, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </details>
                  </td>
                </tr>
                  {activeDisplayId === item.id && (
                    <tr>
                      <td colSpan="9" className="px-0 py-4">
                        <div className="bg-white rounded-lg shadow-md p-4">
                          <div className="flex justify-end mb-2">
                            {/* <button
                              onClick={() => handleCloseDisplay(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash size={14} />
                            </button> */}
                          </div>
                          {console.log("Sample prompts before passing to CS:", item.fullData.selected_prompts)}
                          <CS
                            jdId={item.id}
                            selectedFile={item.file}
                            jdData={{
                              apiResponse: {
                                roles: item.fullData.roles,
                                skills_data: item.fullData.skills_data,
                                achievements: item.fullData.achievements,
                               // selected_prompts: item.fullData.selected_prompts
                              }
                            }}
                            onClose={() => handleCloseDisplay(item.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  )}

              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center space-x-1 border border-gray-200 rounded-md">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border-r border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="px-3 py-1 bg-white text-gray-600">
            Page <span className="font-medium text-gray-800">{currentPage}</span> of <span className="font-medium text-gray-800">{totalPages || 1}</span>
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border-l border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Showing {paginatedList.length} of {jdList.length} records
        </div>
      </div> */}
    </div>
  );  return (
    <div>
      <div className="flex justify-between items-center mb-0">
        <p style={{ fontSize: '18px', marginLeft: '4px' }}>Job Descriptions</p>
        <div className="flex gap-4">
          {['Upload JD'].map((label) => (
            <div key={label}>
              <button
                onClick={() => document.getElementById(`jdFile${label.replace(' ', '')}`).click()}
                className="p-2 text-gray-700 rounded hover:bg-gray-100 flex items-center"
              >
                {buttonConfig[label].icon}
                {label}
              </button>
              <input
                type="file"
                id={`jdFile${label.replace(' ', '')}`}
                className="hidden"
                onChange={handleFileUpload(label)}
                accept=".pdf,.docx,.txt,.json"
              />
            </div>
          ))}
          {jdList.length > 0 && (
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="p-2 text-gray-700 rounded hover:bg-gray-100 flex items-center"
            >
              {showDashboard ? <FaEyeSlash className="mr-2 text-green-500" /> : <FaEye className="mr-2 text-green-500" />}
              {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
            </button>
          )}
        </div>
      </div>
      
      {showDashboard && renderDashboard()}
      
      {isDrawerOpen && selectedJD && (
        <DrawerNavigationJD
          selectedJd={selectedJD}
          onClose={handleDrawerClose}
        />
      )}
    </div>
  );
};

export default JDTab;