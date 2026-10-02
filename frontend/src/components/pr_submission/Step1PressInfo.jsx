// src/components/pr_submission/Step1PressInfo.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Typography,
  TextField, InputLabel, MenuItem, FormControl,
  Select, Divider, Paper, Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CloudUpload } from '@mui/icons-material';
import MuiRichText from '../common/MuiRichText';
import useAuthedFileUrl from '../../hooks/useAuthedFileUrl';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

function htmlHasText(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length > 0;
}

const buildSchema = (existingImage) => yup.object({
  title: yup.string().required('Title is required'),
  summary: yup.string().max(300, 'Summary too long'),
  content: yup
    .string()
    .required('Content is required')
    .test('not-empty-html', 'Content is required', (value) => htmlHasText(value)),
  city: yup.string().required('Select a city'),
  imageFile: yup
    .mixed()
    .test('fileChosen', 'Image is required', (value) => Boolean(value?.name) || Boolean(existingImage))
    .test('fileType', 'Unsupported type', (value) => !value || ALLOWED_IMAGE_TYPES.includes(value.type))
    .test('fileSize', 'Image must be under 20MB', (value) => !value || value.size <= MAX_IMAGE_BYTES),
  quoteDescription: yup.string().max(150),
}).required();

function ImageUploadField({ value, onChange, existingImage, error }) {
  const [localPreview, setLocalPreview] = useState("");
  const existingPreview = useAuthedFileUrl(value ? "" : existingImage);

  useEffect(() => {
    if (!value) {
      setLocalPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(value);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const preview = localPreview || existingPreview;

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
        Upload Image {existingImage ? "(optional if replacing)" : "*"}
      </Typography>
      {preview ? (
        <Box
          component="img"
          src={preview}
          alt="Press release"
          sx={{
            width: "100%",
            maxHeight: 180,
            objectFit: "cover",
            borderRadius: 1,
            mb: 1.5,
            border: "1px solid",
            borderColor: "divider",
          }}
        />
      ) : null}
      <Button
        variant="outlined"
        component="label"
        fullWidth
        startIcon={<CloudUpload />}
        sx={{
          height: 56,
          borderStyle: "dashed",
          borderWidth: 2,
          backgroundColor: value ? "action.hover" : "transparent",
          color: value ? "primary.main" : "text.secondary",
          borderColor: error ? "error.main" : value ? "primary.main" : "divider",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
        }}
      >
        {value?.name || (existingImage ? "Replace image" : "Choose Image File")}
        <input
          type="file"
          hidden
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => onChange(e.target.files[0])}
        />
      </Button>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
          {error}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
        Supported formats: JPEG, PNG, GIF, WebP. Max 20MB.
      </Typography>
    </Box>
  );
}

const cityOptions = [
  "Agartala",
  "Agra",
  "Ahmedabad",
  "Aizawl",
  "Ajmer",
  "Aligarh",
  "Allahabad (Prayagraj)",
  "Ambala",
  "Amravati",
  "Amritsar",
  "Aurangabad",
  "Bareilly",
  "Belgaum",
  "Bengaluru",
  "Bhavnagar",
  "Bhilai",
  "Bhopal",
  "Bhubaneswar",
  "Bhuj",
  "Bikaner",
  "Bilaspur",
  "Bokaro Steel City",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Cuttack",
  "Darbhanga",
  "Dehradun",
  "Delhi (NCR)",
  "Dhanbad",
  "Dharamshala",
  "Dibrugarh",
  "Dimapur",
  "Dispur",
  "Durgapur",
  "Ernakulam",
  "Erode",
  "Faridabad",
  "Firozabad",
  "Gandhinagar",
  "Gangtok",
  "Gaya",
  "Ghaziabad",
  "Gorakhpur",
  "Greater Noida",
  "Gulbarga",
  "Guntur",
  "Gurugram",
  "Guwahati",
  "Gwalior",
  "Haridwar",
  "Hisar",
  "Hubli-Dharwad",
  "Hyderabad",
  "Imphal",
  "Indore",
  "Itanagar",
  "Jabalpur",
  "Jaipur",
  "Jalandhar",
  "Jammu",
  "Jamnagar",
  "Jamshedpur",
  "Jhansi",
  "Jodhpur",
  "Junagadh",
  "Kakinada",
  "Kanchipuram",
  "Kanpur",
  "Karnal",
  "Kochi",
  "Kolhapur",
  "Kolkata",
  "Kollam",
  "Korba",
  "Kota",
  "Kozhikode",
  "Kurnool",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Malappuram",
  "Mangalore",
  "Mathura",
  "Meerut",
  "Moradabad",
  "Mumbai",
  "Muzaffarpur",
  "Mysuru",
  "Nagpur",
  "Nanded",
  "Nashik",
  "Navsari",
  "New Delhi",
  "Noida",
  "Palakkad",
  "Panaji",
  "Panipat",
  "Parbhani",
  "Patiala",
  "Patna",
  "Pondicherry",
  "Prayagraj",
  "Pune",
  "Raipur",
  "Rajahmundry",
  "Rajkot",
  "Ranchi",
  "Ratlam",
  "Rewa",
  "Rohtak",
  "Rourkela",
  "Sagar",
  "Salem",
  "Sambalpur",
  "Satna",
  "Shimla",
  "Shillong",
  "Siliguri",
  "Solapur",
  "Sonipat",
  "Srinagar",
  "Surat",
  "Thanjavur",
  "Thiruvananthapuram",
  "Thrissur",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupati",
  "Tiruppur",
  "Tumakuru",
  "Udaipur",
  "Ujjain",
  "Vadodara",
  "Varanasi",
  "Vasai-Virar",
  "Vellore",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
  "Yamunanagar"
];


/* ─── Component ─────────────────────────────────────────────────── */
export default function Step1PressInfo({ defaultValues, onNext, existingImage = "" }) {
  const schema = useMemo(() => buildSchema(existingImage), [existingImage]);
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
                      key={existingImage || "new-pr"}
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
                <ImageUploadField
                  value={field.value}
                  onChange={field.onChange}
                  existingImage={existingImage}
                  error={errors.imageFile?.message}
                />
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