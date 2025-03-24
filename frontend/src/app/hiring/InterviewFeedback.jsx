import React, { useState } from 'react';
import { 
  Box, Stack, Paper, Typography, Grid, TextField, FormControl, FormLabel, 
  Rating, Button, List, ListItem, ListItemText, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Alert, Tooltip
} from '@mui/material';
import { 
  MessageSquare as FeedbackIcon, 
  Save as SaveIcon, 
  Edit as EditIcon,
  AlertCircle as AlertIcon,
  FileText as DetailsIcon,
  Plus as RequestIcon
} from 'lucide-react';

const InterviewFeedback = () => {
  // Sample mock data - replace with your actual data
  const mockData = {
    interviews: [
      {
        id: 1,
        candidateName: 'John Doe',
        dateTime: '2025-02-13 10:00 AM',
        status: 'Completed',
        position: 'Senior Developer',
        panelists: [
          { name: 'Alice Johnson', score: 4.5, notes: 'Strong technical skills, good communication' },
          { name: 'Bob Smith', score: 3.8, notes: 'Needs improvement in system design' },
          { name: 'Carol White', score: 4.2, notes: 'Great problem-solving approach' }
        ],
        questions: [
          { question: 'Describe your experience with React hooks', answer: 'I have 3 years experience...' },
          { question: 'How would you optimize a slow API?', answer: 'I would implement caching and...' }
        ],
        ranking: 2,
        hasDiscrepancy: true
      },
      {
        id: 2,
        candidateName: 'Jane Smith',
        dateTime: '2025-02-12 2:30 PM',
        status: 'Pending Review',
        position: 'Frontend Developer',
        panelists: [
          { name: 'Alice Johnson', score: 4.8, notes: 'Excellent frontend knowledge' },
          { name: 'Dave Brown', score: 4.7, notes: 'Strong CSS and React skills' }
        ],
        questions: [
          { question: 'Explain CSS Grid vs Flexbox', answer: 'Grid is two-dimensional while...' },
          { question: 'How do you handle state in React?', answer: 'I prefer using hooks like useState...' }
        ],
        ranking: 1,
        hasDiscrepancy: false
      }
    ],
    candidates: [
      { id: 1, name: 'John Doe', position: 'Senior Developer', avgScore: 4.1, ranking: 2 },
      { id: 2, name: 'Jane Smith', position: 'Frontend Developer', avgScore: 4.7, ranking: 1 },
      { id: 3, name: 'Alex Johnson', position: 'Senior Developer', avgScore: 3.9, ranking: 3 }
    ]
  };

  const [feedbackForm, setFeedbackForm] = useState({
    candidateName: '',
    position: '',
    technicalSkills: '',
    communicationSkills: '',
    overallRating: 0
  });

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestNotes, setRequestNotes] = useState('');

  const handleEditFeedback = (id) => {
    console.log('Editing feedback:', id);
  };

  const handleSubmitFeedback = () => {
    console.log('Submitting feedback:', feedbackForm);
  };

  const handleInputChange = (field, value) => {
    setFeedbackForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
    setDetailsOpen(true);
  };

  const handleCompareCandidate = () => {
    setComparisonOpen(true);
  };

  const handleRequestInterview = () => {
    setRequestDialogOpen(true);
  };

  const handleSubmitRequest = () => {
    console.log('Requesting additional interview for:', selectedInterview.candidateName);
    console.log('Request notes:', requestNotes);
    setRequestDialogOpen(false);
    setRequestNotes('');
  };

  const calculateStandardDeviation = (scores) => {
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const squareDiffs = scores.map(score => (score - avg) ** 2);
    const avgSquareDiff = squareDiffs.reduce((sum, diff) => sum + diff, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  };

  return (
    <Box className="p-4">
      <Stack className="space-y-6">
        {/* Feedback Form */}
        <Paper className="p-6">
          <Typography className="text-2xl font-semibold mb-4">
            Interview Feedback Form
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Candidate Name"
                variant="outlined"
                value={feedbackForm.candidateName}
                onChange={(e) => handleInputChange('candidateName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Position"
                variant="outlined"
                value={feedbackForm.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Technical Skills Assessment"
                multiline
                rows={4}
                variant="outlined"
                value={feedbackForm.technicalSkills}
                onChange={(e) => handleInputChange('technicalSkills', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Communication Skills"
                multiline
                rows={4}
                variant="outlined"
                value={feedbackForm.communicationSkills}
                onChange={(e) => handleInputChange('communicationSkills', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Overall Rating</FormLabel>
                <Rating
                  name="overall-rating"
                  value={feedbackForm.overallRating}
                  onChange={(_, value) => handleInputChange('overallRating', value)}
                  precision={0.5}
                  size="large"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                className="bg-pink-600 hover:bg-pink-700"
                onClick={handleSubmitFeedback}
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Previous Feedbacks */}
        <Paper className="p-6">
          <Box className="flex justify-between items-center mb-4">
            <Typography className="text-2xl font-semibold">
              Previous Feedbacks
            </Typography>
            <Button 
              variant="outlined"
              onClick={handleCompareCandidate}
              startIcon={<DetailsIcon className="w-4 h-4" />}
            >
              Compare Candidates
            </Button>
          </Box>
          <List className="divide-y">
            {mockData.interviews.map((interview) => (
              <ListItem
                key={interview.id}
                className="py-4"
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => handleEditFeedback(interview.id)}>
                      <EditIcon className="w-4 h-4" />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleViewDetails(interview)}>
                      <DetailsIcon className="w-4 h-4" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box className="flex items-center">
                      <Typography className="font-semibold mr-2">
                        {interview.candidateName}
                      </Typography>
                      {interview.hasDiscrepancy && (
                        <Tooltip title="Score discrepancy detected">
                          <Chip 
                            icon={<AlertIcon className="w-3 h-3" />} 
                            label="Discrepancy" 
                            size="small" 
                            color="warning"
                          />
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography className="text-gray-600">
                      Position: {interview.position} | Date: {interview.dateTime} | 
                      Status: {interview.status} | Ranking: #{interview.ranking}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Stack>

      {/* Interview Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedInterview && (
          <>
            <DialogTitle>
              <Box className="flex justify-between items-center">
                <Typography variant="h6">
                  Interview Details: {selectedInterview.candidateName}
                </Typography>
                {selectedInterview.hasDiscrepancy && (
                  <Chip 
                    icon={<AlertIcon className="w-3 h-3" />} 
                    label="Score Discrepancy Detected" 
                    color="warning"
                  />
                )}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={4}>
                {selectedInterview.hasDiscrepancy && (
                  <Alert severity="warning">
                    <Typography variant="body2">
                      Significant score variation detected among panelists. 
                      Standard deviation: {calculateStandardDeviation(
                        selectedInterview.panelists.map(p => p.score)
                      ).toFixed(2)}
                    </Typography>
                  </Alert>
                )}

                <Box>
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Position:</strong> {selectedInterview.position}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Date/Time:</strong> {selectedInterview.dateTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Status:</strong> {selectedInterview.status}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Current Ranking:</strong> #{selectedInterview.ranking}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Panel Evaluation
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Panelist</TableCell>
                          <TableCell>Score</TableCell>
                          <TableCell>Notes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedInterview.panelists.map((panelist, index) => (
                          <TableRow key={index}>
                            <TableCell>{panelist.name}</TableCell>
                            <TableCell>
                              <Rating value={panelist.score} precision={0.5} readOnly size="small" />
                            </TableCell>
                            <TableCell>{panelist.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box>
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Questions & Answers
                  </Typography>
                  <List>
                    {selectedInterview.questions.map((qa, index) => (
                      <ListItem key={index} className="flex-col items-start py-3">
                        <Typography variant="body2" className="font-semibold">
                          Q: {qa.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="ml-4">
                          A: {qa.answer}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleRequestInterview()} color="primary" startIcon={<RequestIcon />}>
                Request Additional Interview
              </Button>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Candidate Comparison Dialog */}
      <Dialog
        open={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Candidate Comparison</DialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ranking</TableCell>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Average Score</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockData.candidates.sort((a, b) => a.ranking - b.ranking).map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>#{candidate.ranking}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>
                      <Box className="flex items-center">
                        {candidate.avgScore}
                        <Rating
                          value={candidate.avgScore}
                          precision={0.1}
                          readOnly
                          size="small"
                          className="ml-2"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const interview = mockData.interviews.find(i => i.candidateName === candidate.name);
                          if (interview) {
                            handleViewDetails(interview);
                            setComparisonOpen(false);
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComparisonOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Request Additional Interview Dialog */}
      <Dialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
      >
        <DialogTitle>Request Additional Interview</DialogTitle>
        <DialogContent>
          {selectedInterview && (
            <>
              <Typography variant="body2" className="mb-4">
                Request an additional interview or assessment for {selectedInterview.candidateName}.
              </Typography>
              <TextField
                fullWidth
                label="Reason for Additional Interview"
                multiline
                rows={4}
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                variant="outlined"
                placeholder="Explain why you are requesting an additional interview..."
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitRequest}
            variant="contained"
            disabled={!requestNotes.trim()}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewFeedback;