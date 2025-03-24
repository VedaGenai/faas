import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Lightbulb, Edit, Calendar, Star, X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const InterviewAssignment = () => {
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample fallback data
  const fallbackTeamMembers = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Senior Recruiter',
      rating: 4,
      expertise: ['JavaScript', 'React'],
      pastPerformance: 92,
      availableDates: ['2025-02-20', '2025-02-21', '2025-02-22']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Technical Lead',
      rating: 5,
      expertise: ['System Design', 'Java'],
      pastPerformance: 95,
      availableDates: ['2025-02-21', '2025-02-23', '2025-02-24']
    },
    {
      id: 3,
      name: 'Mike Brown',
      role: 'Senior Developer',
      rating: 4.5,
      expertise: ['Python', 'Machine Learning'],
      pastPerformance: 88,
      availableDates: ['2025-02-20', '2025-02-22', '2025-02-25']
    }
  ];

  const fallbackSchedules = [
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      jobSkills: ['JavaScript', 'React', 'System Design'],
      recruiterId: 1,
      technicalPanelIds: [2, 3],
      startDate: '2025-02-20',
      deadline: '2025-02-25',
      threshold: 85
    },
    {
      id: 2,
      jobTitle: 'Full Stack Developer',
      jobSkills: ['Python', 'Java', 'React'],
      recruiterId: 2,
      technicalPanelIds: [1, 3],
      startDate: '2025-02-25',
      deadline: '2025-02-28',
      threshold: 80
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch team members
        const teamResponse = await axios.get(`${API_BASE_URL}/team-members`);
        if (teamResponse.data && teamResponse.data.length > 0) {
          setTeamMembers(teamResponse.data);
        } else {
          setTeamMembers(fallbackTeamMembers);
        }

        // Fetch schedules
        const schedulesResponse = await axios.get(`${API_BASE_URL}/interview-schedules`);
        if (schedulesResponse.data && schedulesResponse.data.length > 0) {
          setSchedules(schedulesResponse.data);
        } else {
          setSchedules(fallbackSchedules);
        }
      } catch (error) {
        console.log('Error fetching data, using fallback data');
        setTeamMembers(fallbackTeamMembers);
        setSchedules(fallbackSchedules);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTeamPerformance = (recruiter, panel) => {
    const recruiterScore = recruiter?.pastPerformance || 0;
    const panelAvgScore = panel.length > 0 
      ? panel.reduce((acc, member) => acc + (member.pastPerformance || 0), 0) / panel.length
      : 0;
    return Math.round((recruiterScore + panelAvgScore) / 2);
  };

  const getRecommendedTeam = (jobSkills, threshold) => {
    // Recommend based on expertise match and past performance
    const matchedRecruiters = teamMembers
      .filter(member => member.role.includes('Recruiter'))
      .map(recruiter => ({
        ...recruiter,
        score: (recruiter.pastPerformance + 
                recruiter.expertise.filter(exp => jobSkills.includes(exp)).length * 10) / 2
      }))
      .sort((a, b) => b.score - a.score);

    const matchedPanelists = teamMembers
      .filter(member => !member.role.includes('Recruiter'))
      .map(panelist => ({
        ...panelist,
        score: (panelist.pastPerformance + 
                panelist.expertise.filter(exp => jobSkills.includes(exp)).length * 10) / 2
      }))
      .sort((a, b) => b.score - a.score);

    return {
      recommendedRecruiter: matchedRecruiters.length > 0 ? matchedRecruiters[0] : null,
      recommendedPanel: matchedPanelists.slice(0, 2)
    };
  };

  const handleAssignTeam = async (jobId, teamData) => {
    try {
      await axios.post(`${API_BASE_URL}/assign-team`, {
        jobId,
        recruiterId: teamData.recruiterId,
        technicalPanelIds: teamData.technicalPanelIds
      });
      
      // Refresh data after assignment
      const response = await axios.get(`${API_BASE_URL}/interview-schedules`);
      if (response.data && response.data.length > 0) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.log('Error assigning team');
      // No error message shown to user
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-pulse text-blue-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={() => setOpenAssignmentDialog(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Assign New Team
        </button>
        <button
          onClick={() => setShowRecommendations(true)}
          className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          View AI Recommendations
        </button>
      </div>

      {/* Current Assignments Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recruiter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technical Panel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => {
              const recruiter = teamMembers.find(m => m.id === schedule.recruiterId);
              const panel = teamMembers.filter(m => schedule.technicalPanelIds.includes(m.id));
              const performanceScore = calculateTeamPerformance(recruiter, panel);
              
              return (
                <tr key={schedule.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{schedule.jobTitle}</div>
                    <div className="text-sm text-gray-500">
                      {schedule.jobSkills.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {recruiter ? (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {recruiter.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{recruiter.name}</div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(recruiter.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill={i < Math.floor(recruiter.rating || 0) ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Not assigned</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {panel.length > 0 ? (
                      <div className="flex -space-x-2">
                        {panel.map(member => (
                          <div
                            key={member.id}
                            className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white"
                            title={`${member.name} (${member.expertise.join(', ')})`}
                          >
                            {member.name[0]}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Not assigned</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(schedule.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Deadline: {new Date(schedule.deadline).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      performanceScore >= schedule.threshold ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {performanceScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setSelectedJob(schedule);
                        setOpenAssignmentDialog(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* AI Recommendations Dialog */}
      {showRecommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">AI Recommended Teams</h3>
              <button
                onClick={() => setShowRecommendations(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {schedules.map(job => {
              const { recommendedRecruiter, recommendedPanel } = getRecommendedTeam(job.jobSkills, job.threshold);
              return (
                <div key={job.id} className="mb-6 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{job.jobTitle}</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Recommended Recruiter:</p>
                      {recommendedRecruiter ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {recommendedRecruiter.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{recommendedRecruiter.name}</p>
                            <p className="text-xs text-gray-500">Match Score: {Math.round(recommendedRecruiter.score)}%</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No suitable recruiter found</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Recommended Panel:</p>
                      {recommendedPanel.length > 0 ? (
                        <div className="flex space-x-4">
                          {recommendedPanel.map(member => (
                            <div key={member.id} className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                {member.name[0]}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-gray-500">Match Score: {Math.round(member.score)}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No suitable panel members found</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        handleAssignTeam(job.id, {
                          recruiterId: recommendedRecruiter?.id,
                          technicalPanelIds: recommendedPanel.map(m => m.id)
                        });
                        setShowRecommendations(false);
                      }}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Apply Recommendation
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assignment Dialog */}
      {openAssignmentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedJob ? `Edit Team Assignment: ${selectedJob.jobTitle}` : 'Assign New Interview Team'}
              </h3>
              <button
                onClick={() => {
                  setOpenAssignmentDialog(false);
                  setSelectedJob(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Assignment form would go here */}
            <div className="space-y-4">
              {/* Form implementation omitted for brevity */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {
                    setOpenAssignmentDialog(false);
                    setSelectedJob(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedJob ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewAssignment;
