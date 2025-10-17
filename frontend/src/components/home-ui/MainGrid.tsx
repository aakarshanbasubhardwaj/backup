import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import Copyright from '../internals/components/Copyright';
// import CustomizedTreeView from './CustomizedTreeView';
// import CustomizedDataGrid from './CustomizedDataGrid';
// import HighlightedCard from './HighlightedCard';
// import PageViewsBarChart from './PageViewsBarChart';
// import SessionsChart from './SessionsChart';
import StatCard, { type StatCardProps } from '../home-ui/StatCard';
import ChartStorageUsedByUser from './ChartStorageUsedByUser';

const data: StatCardProps[] = [
  {
    title: 'Storage Activity',
    value: '20GB',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
 
];

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          {/* <HighlightedCard /> */}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* <SessionsChart /> */}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* <PageViewsBarChart /> */}
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        {/* <Grid size={{ xs: 12, lg: 9 }}> */}
          {/* <CustomizedDataGrid /> */}
        {/* </Grid> */}
        {/* <Grid size={{ xs: 12, lg: 3 }}> */}
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            {/* <CustomizedTreeView /> */}
            <ChartStorageUsedByUser />
          </Stack>
        {/* </Grid> */}
      </Grid>
      {/* <Copyright sx={{ my: 4 }} /> */}
    </Box>
  );
}
