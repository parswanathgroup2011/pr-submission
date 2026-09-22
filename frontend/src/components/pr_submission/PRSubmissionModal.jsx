import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Stepper, Step, StepLabel, Box, Typography, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Step1PressInfo from './Step1PressInfo';
import Step2TagsScheduler from './Step2TagsScheduler';
import Step3PlanSelection from './Step3PlanSelection';

import { createPressRelease, updatePressRelease } from '../../services/pressReleaseService';
import { handleSuccess, handleError } from '../../utils';

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
  selectedPlan: '',
  selectedCategory: '',
};

export default function PRSubmissionModal({
  isOpen,
  onClose,
  onPRSubmittedSuccessfully,
  editPressRelease = null
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
          imageFile: null,
          city: editPressRelease.city || '',
          quoteDescription: editPressRelease.quoteDescription || '',
          tags: editPressRelease.tags || [],
          scheduledAt: editPressRelease.scheduledAt || null,
          selectedPlan: editPressRelease.selectedPlan?._id || '',
          selectedCategory: editPressRelease.selectedCategory?._id || '',
        });
      } else {
        setFormData(initialData);
      }
    }
  }, [isOpen, editPressRelease]);

  const next = () => setActiveStep((s) => s + 1);
  const back = () => setActiveStep((s) => s - 1);

  const updateAndNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    next();
  };

  const handleStep3Submit = (step3Data) => {
    const finalData = { ...formData, ...step3Data };
    setFormData(finalData);
    handleSubmitPR(finalData);
  };

  const handleSubmitPR = async (finalData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = new FormData();
      const skipKeys = new Set(['imageFile', 'subMember']);

      Object.entries(finalData).forEach(([key, val]) => {
        if (skipKeys.has(key)) return;
        if (key === 'tags') {
          (Array.isArray(val) ? val : []).forEach((item) => payload.append('tags', item));
          return;
        }
        if (val !== null && val !== '') {
          payload.append(key, val);
        }
      });

      if (finalData.imageFile) {
        payload.append('image', finalData.imageFile);
      }

      if (editPressRelease) {
        await updatePressRelease(editPressRelease._id, payload);
        handleSuccess("Press release updated");
      } else {
        await createPressRelease(payload);
        handleSuccess("Press release created");
      }

      onPRSubmittedSuccessfully();
    } catch (err) {
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
        return (
          <Step1PressInfo
            defaultValues={formData}
            onNext={updateAndNext}
            existingImage={editPressRelease?.image || ""}
          />
        );
      case 1:
        return <Step2TagsScheduler defaultValues={formData} onBack={back} onNext={updateAndNext} />;
      case 2:
        return (
          <Step3PlanSelection
            defaultValues={formData}
            onBack={back}
            onSubmit={handleStep3Submit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (isSubmitting) return;
        if (reason === "backdropClick") return;
        onClose();
      }}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1.5 }}>
        {editPressRelease ? "Edit press release" : "Submit press release"}
        <IconButton onClick={onClose} disabled={isSubmitting} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
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
            bgcolor: 'action.disabledBackground',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  );
}
