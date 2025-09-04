// src/components/pr_submission/Step1PressInfo.jsx
import React from 'react';
import  { useEffect } from 'react'; // ← Add this
import {
  Grid, Box, Button, Typography,
  TextField, InputLabel, MenuItem, FormControl,
  Select, Divider, Paper, Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CloudUpload } from '@mui/icons-material';
import MuiRichText from '../common/MuiRichText';

/* ─── Validation schema ─────────────────────────────────────────── */
const schema = yup.object({
  title:               yup.string().required('Title is required'),
  summary:             yup.string().max(300, 'Summary too long'),
  content:             yup.string().required('Content is required'),
 
  city:                yup.string().required('Select a city'),
  imageFile: yup
    .mixed()
    .test('fileChosen', 'Image is required', v => !!v?.name)
    .test(
      'fileType',
      'Unsupported type',
      v => !v || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(v.type)
    ),
  quoteDescription: yup.string().max(150),
}).required();

/* ─── Select options (replace later with API data) ──────────────── */
const subMemberOptions = [
  { value: 'userA_id', label: 'Nikhil Jain (8200183354)' },
  { value: 'userB_id', label: 'Another Member' },
];
const cityOptions = ['New Delhi', 'Mumbai', 'Bangalore', 'Ahmedabad'];

/* ─── Component ─────────────────────────────────────────────────── */
export default function Step1PressInfo({ defaultValues, onNext }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  useEffect(() => {
    reset(defaultValues); // ← Add this
  }, [defaultValues, reset]);
  /* Hand valid data upward then advance step */
  const onSubmit = data => onNext(data);

  return (
    <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper' }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          {/* ── Header Section ─────────────────────────────── */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Press Release Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Fill in the details for your press release. Fields marked with * are required.
            </Typography>
          </Box>

          {/* ── Title Field ───────────────────────────────── */}
          <Box>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Press Release Title"
                  placeholder="Enter a compelling title for your press release"
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* ── Summary Field ─────────────────────────────── */}
          <Box>
            <Controller
              name="summary"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Summary"
                  placeholder="Brief summary of your press release (optional, max 300 characters)"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.summary}
                  helperText={errors.summary?.message || `${field.value?.length || 0}/300 characters`}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* ── Content Section ───────────────────────────── */}
          <Box>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    Press Release Content *
                  </Typography>
                  <Box sx={{ border: errors.content ? '1px solid' : 'none', 
                           borderColor: 'error.main', borderRadius: 1 }}>
                    <MuiRichText
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Box>
                  {errors.content && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.content.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
          </Box>


          <Divider sx={{ my: 1 }} />

          {/* ── Sub Member Field ─────────────────────────── */}
          {/* <Box>
            <Controller
              name="subMember"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.subMember}>
                  <InputLabel>Sub Member *</InputLabel>
                  <Select 
                    {...field} 
                    label="Sub Member *"
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    {subMemberOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subMember && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.subMember.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Box> */}

          {/* ── City Field ────────────────────────────────── */}
          <Box>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.city}>
                  <InputLabel>City *</InputLabel>
                  <Select 
                    {...field} 
                    label="City *"
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    {cityOptions.map(city => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.city && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.city.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Box>

          {/* ── Image Upload Field ───────────────────────── */}
          <Box>
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    Upload Image *
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUpload />}
                    sx={{ 
                      height: 56,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      backgroundColor: field.value ? 'action.hover' : 'transparent',
                      color: field.value ? 'primary.main' : 'text.secondary',
                      borderColor: errors.imageFile ? 'error.main' : field.value ? 'primary.main' : 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    {field.value?.name || 'Choose Image File'}
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={e => field.onChange(e.target.files[0])}
                    />
                  </Button>
                  {errors.imageFile && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.imageFile.message}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Supported formats: JPEG, PNG, GIF, WebP
                  </Typography>
                </Box>
              )}
            />
          </Box>

          {/* ── Quote/Description Field ─────────────────── */}
          <Box>
            <Controller
              name="quoteDescription"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Quote / Image Description"
                  placeholder="Add a quote or describe the image (optional)"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.quoteDescription}
                  helperText={errors.quoteDescription?.message || `${field.value?.length || 0}/150 characters`}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* ── Navigation ─────────────────────────────── */}
<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
  <Button type="submit" variant="contained">
    Next
  </Button>
</Box>


        
         


        </Stack>
      </Box>
    </Paper>
  );
}