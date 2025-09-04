// src/components/pr_submission/Step2TagsScheduler.jsx
import React, { useEffect } from 'react';

import {
  Box, Stack, TextField, Button, Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/* ─── Validation ────────────────────────────────────────── */
const schema = yup.object({
  tags: yup
    .array()
    .of(yup.string().trim().max(30))
    .min(1, 'Add at least one tag')
    ,
  scheduledAt: yup
    .date()
    .nullable()
    .typeError('Pick a valid date & time'),
}).required();

/* ─── Component ─────────────────────────────────────────── */
export default function Step2TagsScheduler({ defaultValues, onBack, onNext }) {
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
  reset(defaultValues); // ← add this to reinitialize when editing
}, [defaultValues, reset]);


  const submit = data => onNext(data);

  return (
    <Box component="form" onSubmit={handleSubmit(submit)} noValidate>
      <Stack spacing={3}>
        {/* ── Tags ───────────────────────────── */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              freeSolo
              options={[] /* could preload popular tags */}
              value={field.value || []}
              onChange={(_, v) => field.onChange(v)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="PR Tags *"
                  placeholder="Type a tag and press Enter"
                  error={!!errors.tags}
                  helperText={errors.tags?.message}
                />
              )}
            />
          )}
        />

        {/* ── Scheduler ─────────────────────── */}
        <Controller
          name="scheduledAt"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                {...field}
                label="Schedule publish time (optional)"
                value={field.value ? dayjs(field.value) : null}
                onChange={v => field.onChange(v ? v.toISOString() : null)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.scheduledAt,
                    helperText: errors.scheduledAt?.message,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        />

        {/* ── Navigation ─────────────────────────────── */}
<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
  <Button variant="outlined" onClick={onBack}>
    Back
  </Button>
  <Button type="submit" variant="contained">
    Next
  </Button>
</Box>


        
      </Stack>
    </Box>
  );
}
