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
  const [municipality, setMunicipality] = useState('milano');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [classificationResult, setClassificationResult] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // List of municipalities (example data)
  const municipalities = [
    { value: 'milano', label: 'Milano' },
    { value: 'abbiategrasso', label: 'Abbiategrasso' },
    { value: 'albairate', label: 'Albairate' },
    { value: 'arconate', label: 'Arconate' },
    { value: 'arese', label: 'Arese' },
    { value: 'arluno', label: 'Arluno' },
    { value: 'assago', label: 'Assago' },
    { value: 'baranzate', label: 'Baranzate' },
    { value: 'bareggio', label: 'Bareggio' },
    { value: 'basiano', label: 'Basiano' },
    { value: 'basiglio', label: 'Basiglio' },
    { value: 'bellinzago-lombardo', label: 'Bellinzago Lombardo' },
    { value: 'bernate-ticino', label: 'Bernate Ticino' },
    { value: 'besate', label: 'Besate' },
    { value: 'binasco', label: 'Binasco' },
    { value: 'boffalora-sopra-ticino', label: 'Boffalora Sopra Ticino' },
    { value: 'bollate', label: 'Bollate' },
    { value: 'bresso', label: 'Bresso' },
    { value: 'bubbiano', label: 'Bubbiano' },
    { value: 'buccinasco', label: 'Buccinasco' },
    { value: 'buscate', label: 'Buscate' },
    { value: 'bussero', label: 'Bussero' },
    { value: 'busto-garolfo', label: 'Busto Garolfo' },
    { value: 'calvignasco', label: 'Calvignasco' },
    { value: 'cambiago', label: 'Cambiago' },
    { value: 'canegrate', label: 'Canegrate' },
    { value: 'carpiano', label: 'Carpiano' },
    { value: 'carugate', label: 'Carugate' },
    { value: 'casarile', label: 'Casarile' },
    { value: 'casorezzo', label: 'Casorezzo' },
    { value: 'cassano-d-adda', label: "Cassano d'Adda" },
    { value: 'cassina-de-pecchi', label: "Cassina de' Pecchi" },
    { value: 'cassinetta-di-lugagnano', label: 'Cassinetta di Lugagnano' },
    { value: 'castano-primo', label: 'Castano Primo' },
    { value: 'cernusco-sul-naviglio', label: 'Cernusco sul Naviglio' },
    { value: 'cerro-maggiore', label: 'Cerro Maggiore' },
    { value: 'cerro-al-lambro', label: 'Cerro al Lambro' },
    { value: 'cesano-boscone', label: 'Cesano Boscone' },
    { value: 'cesate', label: 'Cesate' },
    { value: 'cinisello-balsamo', label: 'Cinisello Balsamo' },
    { value: 'cisliano', label: 'Cisliano' },
    { value: 'cologno-monzese', label: 'Cologno Monzese' },
    { value: 'colturano', label: 'Colturano' },
    { value: 'corbetta', label: 'Corbetta' },
    { value: 'cormano', label: 'Cormano' },
    { value: 'cornaredo', label: 'Cornaredo' },
    { value: 'corsico', label: 'Corsico' },
    { value: 'cuggiono', label: 'Cuggiono' },
    { value: 'cusago', label: 'Cusago' },
    { value: 'cusano-milanino', label: 'Cusano Milanino' },
    { value: 'dairago', label: 'Dairago' },
    { value: 'dresano', label: 'Dresano' },
    { value: 'gaggiano', label: 'Gaggiano' },
    { value: 'garbagnate-milanese', label: 'Garbagnate Milanese' },
    { value: 'gessate', label: 'Gessate' },
    { value: 'gorgonzola', label: 'Gorgonzola' },
    { value: 'grezzago', label: 'Grezzago' },
    { value: 'gudo-visconti', label: 'Gudo Visconti' },
    { value: 'inveruno', label: 'Inveruno' },
    { value: 'inzago', label: 'Inzago' },
    { value: 'lacchiarella', label: 'Lacchiarella' },
    { value: 'lainate', label: 'Lainate' },
    { value: 'legnano', label: 'Legnano' },
    { value: 'liscate', label: 'Liscate' },
    { value: 'locate-di-triulzi', label: 'Locate di Triulzi' },
    { value: 'magenta', label: 'Magenta' },
    { value: 'magnago', label: 'Magnago' },
    { value: 'marcallo-con-casone', label: 'Marcallo con Casone' },
    { value: 'masate', label: 'Masate' },
    { value: 'mediglia', label: 'Mediglia' },
    { value: 'melegnano', label: 'Melegnano' },
    { value: 'melzo', label: 'Melzo' },
    { value: 'mesero', label: 'Mesero' },
    { value: 'milano', label: 'Milano' },
    { value: 'morimondo', label: 'Morimondo' },
    { value: 'motta-visconti', label: 'Motta Visconti' },
    { value: 'nerviano', label: 'Nerviano' },
    { value: 'nosate', label: 'Nosate' },
    { value: 'novate-milanese', label: 'Novate Milanese' },
    { value: 'noviglio', label: 'Noviglio' },
    { value: 'opera', label: 'Opera' },
    { value: 'ossona', label: 'Ossona' },
    { value: 'ozzero', label: 'Ozzero' },
    { value: 'paderno-dugnano', label: 'Paderno Dugnano' },
    { value: 'pantigliate', label: 'Pantigliate' },
    { value: 'parabiago', label: 'Parabiago' },
    { value: 'paullo', label: 'Paullo' },
    { value: 'pero', label: 'Pero' },
    { value: 'peschiera-borromeo', label: 'Peschiera Borromeo' },
    { value: 'pessano-con-bornago', label: 'Pessano con Bornago' },
    { value: 'pieve-emanuele', label: 'Pieve Emanuele' },
    { value: 'pioltello', label: 'Pioltello' },
    { value: 'pogliano-milanese', label: 'Pogliano Milanese' },
    { value: 'pozzo-d-adda', label: "Pozzo d'Adda" },
    { value: 'pozzuolo-martesana', label: 'Pozzuolo Martesana' },
    { value: 'pregnana-milanese', label: 'Pregnana Milanese' },
    { value: 'rescaldina', label: 'Rescaldina' },
    { value: 'rho', label: 'Rho' },
    { value: 'robecchetto-con-induno', label: 'Robecchetto con Induno' },
    { value: 'robecco-sul-naviglio', label: 'Robecco sul Naviglio' },
    { value: 'rodano', label: 'Rodano' },
    { value: 'rosate', label: 'Rosate' },
    { value: 'rozzano', label: 'Rozzano' },
    { value: 'san-colombano-al-lambro', label: 'San Colombano al Lambro' },
    { value: 'san-donato-milanese', label: 'San Donato Milanese' },
    { value: 'san-giorgio-su-legnano', label: 'San Giorgio su Legnano' },
    { value: 'san-giuliano-milanese', label: 'San Giuliano Milanese' },
    { value: 'san-vittore-olona', label: 'San Vittore Olona' },
    { value: 'san-zenone-al-lambro', label: 'San Zenone al Lambro' },
    { value: 'santo-stefano-ticino', label: 'Santo Stefano Ticino' },
    { value: 'sedriano', label: 'Sedriano' },
    { value: 'segrate', label: 'Segrate' },
    { value: 'senago', label: 'Senago' },
    { value: 'sesto-san-giovanni', label: 'Sesto San Giovanni' },
    { value: 'settala', label: 'Settala' },
    { value: 'settimo-milanese', label: 'Settimo Milanese' },
    { value: 'solaro', label: 'Solaro' },
    { value: 'trezzano-rosa', label: 'Trezzano Rosa' },
    { value: 'trezzano-sul-naviglio', label: 'Trezzano sul Naviglio' },
    { value: 'trezzo-sull-adda', label: "Trezzo sull'Adda" },
    { value: 'tribiano', label: 'Tribiano' },
    { value: 'truccazzano', label: 'Truccazzano' },
    { value: 'turbigo', label: 'Turbigo' },
    { value: 'vanzaghello', label: 'Vanzaghello' },
    { value: 'vanzago', label: 'Vanzago' },
    { value: 'vaprio-d-adda', label: "Vaprio d'Adda" },
    { value: 'vermezzo', label: 'Vermezzo' },
    { value: 'vernate', label: 'Vernate' },
    { value: 'vignate', label: 'Vignate' },
    { value: 'villa-cortese', label: 'Villa Cortese' },
    { value: 'vimodrone', label: 'Vimodrone' },
    { value: 'vittuone', label: 'Vittuone' },
    { value: 'vizzolo-predabissi', label: 'Vizzolo Predabissi' },
    { value: 'zelo-surrigone', label: 'Zelo Surrigone' },
    { value: 'zibido-san-giacomo', label: 'Zibido San Giacomo' }
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
