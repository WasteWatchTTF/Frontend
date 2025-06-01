import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { classificationAPI } from '../../services/api';
import { useAuth } from '../../services/AuthContext';

const steps = ['Seleziona un\'immagine', 'Specifica il comune', 'Classificazione'];

function ImageClassification() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [municipality, setMunicipality] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [classificationResult, setClassificationResult] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // List of municipalities (example data)
  const municipalities = [
    { value: 'default', label: 'Predefinito' },
    { value: 'roma', label: 'Roma' },
    { value: 'milano', label: 'Milano' },
    { value: 'napoli', label: 'Napoli' },
    { value: 'torino', label: 'Torino' },
    { value: 'firenze', label: 'Firenze' },
    { value: 'bologna', label: 'Bologna' },
    { value: 'genova', label: 'Genova' },
    { value: 'palermo', label: 'Palermo' },
    { value: 'bari', label: 'Bari' },
    { value: 'catania', label: 'Catania' }
  ];

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // Reset any previous errors
      setError('');
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1
  });

  const handleNext = () => {
    if (activeStep === 0 && !selectedFile) {
      setError('Seleziona un\'immagine prima di continuare');
      return;
    }
    
    if (activeStep === steps.length - 1) {
      // Final step - submit for classification
      submitClassification();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const submitClassification = async () => {
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('municipality', municipality);
      
      const response = await classificationAPI.classifyImage(formData);
      
      if (response.data) {
        if (response.data.status === 'SUCCESS' && response.data.result) {
          // Classification completed immediately
          setClassificationResult(response.data.result);
          setImageId(response.data.imageId);
        } else {
          // Classification is being processed asynchronously
          setTaskId(response.data.taskId);
          setImageId(response.data.imageId);
          
          // Start polling for results
          startPolling(response.data.taskId);
        }
      } else {
        setError('Risposta non valida dal server');
      }
    } catch (err) {
      console.error('Error during classification:', err);
      setError('Si è verificato un errore durante la classificazione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (taskId) => {
    // Poll every 2 seconds for classification status
    const interval = setInterval(async () => {
      try {
        const response = await classificationAPI.getClassificationStatus(taskId);
        
        if (response.data.status === 'SUCCESS') {
          // Classification completed - now get the actual result
          try {
            const resultResponse = await classificationAPI.getClassificationResult(taskId);
            if (resultResponse.data && resultResponse.data.status === 'SUCCESS') {
              // Use the result from the result endpoint
              setClassificationResult(resultResponse.data.result || resultResponse.data);
              clearInterval(interval);
              setPollingInterval(null);
              setLoading(false);
            } else {
              // Handle case where status endpoint says SUCCESS but result endpoint doesn't have data yet
              console.log('Status is SUCCESS but result not ready yet, continuing polling...');
            }
          } catch (resultErr) {
            console.error('Error getting classification result:', resultErr);
            // Continue polling in case it's a temporary error
          }
        } else if (response.data.status === 'FAILURE' || response.data.status === 'FAILED') {
          // Classification failed
          setError('La classificazione è fallita. Riprova con un\'altra immagine.');
          clearInterval(interval);
          setPollingInterval(null);
          setLoading(false);
        }
        // If status is still PENDING, continue polling
      } catch (err) {
        console.error('Error polling for classification status:', err);
        setError('Errore durante il controllo dello stato della classificazione');
        clearInterval(interval);
        setPollingInterval(null);
        setLoading(false);
      }
    }, 2000);
    
    setPollingInterval(interval);
  };

  // Clean up polling interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleViewDetails = () => {
    if (imageId) {
      // Se abbiamo l'imageId, passiamolo tramite lo stato per facilitare il recupero
      navigate(`/classification/result/${taskId}`, { 
        state: { 
          imageId: imageId,
          municipality: municipality,
          category: classificationResult?.category,
          confidence: classificationResult?.confidence
        } 
      });
    } else {
      navigate(`/classification/result/${taskId}`);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setMunicipality('default');
    setActiveStep(0);
    setClassificationResult(null);
    setTaskId(null);
    setImageId(null);
    setError('');
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '16px' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Clicca o trascina per cambiare immagine
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Trascina qui un'immagine o clicca per selezionarla
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supporta JPG, PNG, GIF fino a 5MB
                  </Typography>
                </Box>
              )}
            </div>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img
                    src={previewUrl}
                    alt="Selected"
                    style={{ maxWidth: '100%', maxHeight: '250px' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Specifica il tuo comune
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Seleziona il tuo comune per ottenere informazioni precise sullo smaltimento dei rifiuti in base alle regole locali.
                  </Typography>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="municipality-label">Comune</InputLabel>
                    <Select
                      labelId="municipality-label"
                      id="municipality"
                      value={municipality}
                      label="Comune"
                      onChange={(e) => setMunicipality(e.target.value)}
                    >
                      {municipalities.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} className="pulse-animation" />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Classificazione in corso...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stiamo analizzando la tua immagine. Questo potrebbe richiedere alcuni secondi.
                </Typography>
              </Box>
            ) : classificationResult ? (
              <Card sx={{ mb: 3 }} className="classification-result-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 32, mr: 1 }} />
                    <Typography variant="h5">
                      Classificazione completata!
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <img
                          src={previewUrl}
                          alt="Classified"
                          style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Risultato:
                      </Typography>
                      <Typography variant="h5" color="primary" gutterBottom>
                        {classificationResult.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Confidenza: {Math.round(classificationResult.confidence * 100)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Comune: {municipalities.find(m => m.value === municipality)?.label || municipality}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleViewDetails}
                        sx={{ mt: 2 }}
                      >
                        Vedi dettagli completi
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : taskId ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} className="pulse-animation" />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Classificazione in corso...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  La tua richiesta è in elaborazione. Attendi mentre analizziamo l'immagine.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  ID Task: {taskId}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6">
                  Pronto per la classificazione
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clicca su "Classifica" per iniziare l'analisi dell'immagine.
                </Typography>
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <PhotoCameraIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Classifica Rifiuti
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Carica un'immagine del rifiuto che vuoi classificare e scopri come smaltirlo correttamente.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            Indietro
          </Button>
          <Box>
            {classificationResult && (
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ mr: 1 }}
                disabled={loading}
              >
                Nuova Classificazione
              </Button>
            )}
            {activeStep === steps.length - 1 && !classificationResult && !taskId ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Classifica'}
              </Button>
            ) : activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || (activeStep === 0 && !selectedFile)}
              >
                Avanti
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            Accedi o registrati per salvare le tue classificazioni e guadagnare punti eco!
          </Typography>
        </Alert>
      )}
    </Container>
  );
}

export default ImageClassification;
