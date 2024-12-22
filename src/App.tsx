import React from 'react';
import DateRangePicker from './components/DateRangePicker';

const App: React.FC = () => {
  const handleDateRangeChange = (range: [string, string], weekends: string[]) => {
    console.log('Selected Date Range:', range);
    console.log('Weekends in Range:', weekends);
  };

  const predefinedRanges = [
    {
      label: 'Last 7 Days',
      range: [
        new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
      ] as [string, string],
    },
    {
      label: 'Last 30 Days',
      range: [
        new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
      ] as [string, string],
    },
  ];

  return (
    <div>
      <h1>Date Range Picker</h1>
      <DateRangePicker
        onChange={handleDateRangeChange}
        predefinedRanges={predefinedRanges}
      />
    </div>
  );
};

export default App;
