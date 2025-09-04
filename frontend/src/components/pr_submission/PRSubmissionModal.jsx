// src/components/pr_submission/PRSubmissionModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Stepper, Step, StepLabel, Box, Typography, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Step1PressInfo from './Step1PressInfo';
import Step2TagsScheduler from './Step2TagsScheduler';
import Step3PlanSelection from './Step3PlanSelection';

import { createPressRelease,updatePressRelease } from '../../services/pressReleaseService';
import { handleSuccess,handleError } from '../../utils';

const steps = ['Press Information', 'Tags & Scheduler', 'Plan'];

const initialData = {
  title: '',
  summary: '',
  content: '',
  subMember: '',
  imageFile: null,
  city: '',
  quoteDescription: '',
  tags: [],
  scheduledAt: null,
  selectedLanguageForFilter: 'English',
  selectedPlan: '',
  selectedCategory: '',
};

export default function PRSubmissionModal({
  isOpen,
  onClose,
  onPRSubmittedSuccessfully,
  editPressRelease=null
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setError(null);
  
      if (editPressRelease) {
        setFormData({
          title: editPressRelease.title || '',
          summary: editPressRelease.summary || '',
          content: editPressRelease.content || '',
          subMember: editPressRelease.subMember || '',
          imageFile: null, // Optional: for new uploads
          city: editPressRelease.city || '',
          quoteDescription: editPressRelease.quoteDescription || '',
          tags: editPressRelease.tags || [],
          scheduledAt: editPressRelease.scheduledAt || null,
          selectedLanguageForFilter: 'English',
          selectedPlan: editPressRelease.selectedPlan?._id || '',
          selectedCategory: editPressRelease.selectedCategory?._id || '',
        });
      } else {
        setFormData(initialData);
      }
    }
  }, [isOpen, editPressRelease]);
  

  const next = () => setActiveStep(s => s + 1);
  const back = () => setActiveStep(s => s - 1);

  const updateAndNext = data => {
    setFormData(prev => ({ ...prev, ...data }));
    next();
  };

  const handleStep3Submit = step3Data => {
    console.log("🚀 Step 3 Submit Called", step3Data);
    const finalData = { ...formData, ...step3Data };
    setFormData(finalData);
    handleSubmitPR(finalData);
  };
  const handleSubmitPR = async (finalData) => {
    console.log("📦 Submitting finalData:", finalData);
    setIsSubmitting(true);
    setError(null);
  
    try {
      const payload = new FormData();
  
      Object.entries(finalData).forEach(([key, val]) => {
        if (key === 'imageFile') {
          if (val) payload.append('image', val);
        } else if (Array.isArray(val)) {
          val.forEach(item => payload.append(`${key}[]`, item));
        } else if (val !== null && val !== '') {
          payload.append(key, val);
        }
      });
  
      for (let [key, value] of payload.entries()) {
        console.log(`🧾 ${key}:`, value);
      }
  
      //  Check if editing or creating
      if (editPressRelease) {
        await updatePressRelease(editPressRelease._id, payload);
        handleSuccess("Press-release updated! 🎉");
      } else {
        await createPressRelease(payload);
        handleSuccess("Press-release created! 🎉");
      }
  
      onPRSubmittedSuccessfully(); // close modal + refresh list
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || err.message || 'Submission failed';
      setError(message);
      handleError(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1PressInfo defaultValues={formData} onNext={updateAndNext} />;
      case 1:
        return <Step2TagsScheduler defaultValues={formData} onBack={back} onNext={updateAndNext} />;
      case 2:
        return <Step3PlanSelection defaultValues={formData} onBack={back} onSubmit={handleStep3Submit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      sx={{ '& .MuiDialog-container > .MuiPaper-root': { borderRadius: 3, p: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        Submit New Press Release
        <IconButton onClick={onClose} disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {getStepContent()}
      </DialogContent>

      {isSubmitting && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255,255,255,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  );
}
