import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Stack, Typography, Paper, Button,
  TextField, Autocomplete, Table, TableBody, TableRow, TableCell
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { getAllPlans } from '../../services/planService';
import { getAllCategories } from '../../services/categoryService';


/* ─── Validation ────────────────────────────────────────── */
const schema = yup.object({
  selectedPlan:       yup.string().required('Select your plan'),
  selectedCategory: yup.string().required('Select a category'),
}).required();

/* ─── Component ─────────────────────────────────────────── */
export default function Step3PlanSelection({
  defaultValues,
  onBack,
  onSubmit,          // final submit from the modal
  isSubmitting,
  hideActions = false,
  formId,
}) {
  const [plans, setPlans]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingPlans, setLoadingPlans]         = useState(true);
  const [loadingCats,  setLoadingCats]          = useState(true);


  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  useEffect(() => {
    reset(defaultValues);  // ← ADD this to update form when editing
  }, [defaultValues, reset]);
  

  const selectedPlanId= watch('selectedPlan');
  const selectedCategoryId = watch('selectedCategory');


  const selectedPlanObj = useMemo(
    () => plans.find(p => p._id === selectedPlanId),
    [plans, selectedPlanId]
  );

  /* ── fetch all plans once ─────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const plansArr = await getAllPlans();   // ← uses your service
        setPlans(plansArr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPlans(false);
      }
    })();

    (async () => {
      try {
        const catArr = await getAllCategories();
        setCategories(catArr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);



  const submit = data => onSubmit(data);        // pass up to modal

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box
        component="form"
        id={formId}
        noValidate
        onSubmit={handleSubmit(submit)}
      >
        <Stack spacing={4}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Plan
          </Typography>

          {/* ── Select Plan ───────────────────────────── */}
 
<Controller
  name="selectedPlan"
  control={control}
  render={({ field }) => {
    // find option object matching the selectedPlanId string
    const selectedOption = plans.find(p => p._id === field.value) || null;

    return (
      <Autocomplete
        options={plans}
        getOptionLabel={p => p?.name || ''}
        loading={loadingPlans}
        value={selectedOption}               // pass full object or null
        onChange={(_, newValue) => {
          field.onChange(newValue ? newValue._id : '');
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="Select your plan *"
            error={!!errors.selectedPlan}
            helperText={errors.selectedPlan?.message}
          />
        )}
      />
    );
  }}
/>



<Controller
  name="selectedCategory"
  control={control}
  render={({ field }) => {
    const selectedOption = categories.find(c => c._id === field.value) || null;

    return (
      <Autocomplete
        options={categories}
        getOptionLabel={c => c?.name || ''}
        loading={loadingCats}
        value={selectedOption}              // pass full object or null
        onChange={(_, newValue) => {
          field.onChange(newValue ? newValue._id : '');
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="Select Category *"
            error={!!errors.selectedCategory}
            helperText={errors.selectedCategory?.message}
          />
        )}
      />
    );
  }}
/>
          {/* ── Plan summary ─────────────────────────── */}
          {selectedPlanObj && (
  <Box
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      p: 2,
    }}
  >
    <Typography variant="h6" align="center" sx={{ mb: 1 }}>
      {selectedPlanObj.name}
    </Typography>

    <Typography
      variant="h4"
      color="success.main"
      align="center"
      sx={{ mb: 2 }}
    >
      {selectedPlanObj.credits.toLocaleString()} credits
    </Typography>

    <Table size="small"  sx={{
    mt: 2,
    border: '1px solid #e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
    '& .MuiTableCell-root': {
      borderBottom: '1px solid #f0f0f0',
      padding: '12px 16px',
    },
    '& .MuiTableRow-root:last-child .MuiTableCell-root': {
      borderBottom: 'none',
    },
    '& td:first-of-type': {
      fontWeight: 600,
      color: 'text.secondary',
      width: '40%',
    },
    '& td:last-of-type': {
      color: 'text.primary',
    },
  }}>
      <TableBody>
        <TableRow>
          <TableCell>TAT</TableCell>
          <TableCell>{selectedPlanObj.tat}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Disclaimer</TableCell>
          <TableCell>{selectedPlanObj.disclaimer ? 'Yes' : 'No'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Backlink</TableCell>
          <TableCell>{selectedPlanObj.backlink ? 'Yes' : 'No'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>{selectedPlanObj.websiteCountText}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Box>
)}

          

          {/* ── Navigation buttons (omit if using outer bar) ── */}
          {!hideActions && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={onBack} disabled={isSubmitting} sx={{backgroundColor:'royalblue',color:'white',border:'none'}}>
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Submit'}
              </Button>
            </Box>
          )}


        </Stack>
      </Box>
    </Paper>
  );
}
