'use client';
import { useState, useEffect } from 'react';
import { supabase } from 'superbase';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Analytics() {
  const [vacanciesStats, setVacanciesStats] = useState({ total: 0, open: 0, closed: 0 });
  const [applicantStats, setApplicantStats] = useState(0);
  const [companyStats, setCompanyStats] = useState(0);

  useEffect(() => {
    async function fetchVacancyStats() {
      const { count: totalCount, error: totalError } = await supabase
        .from('vacancies')
        .select('id', { count: 'exact', head: true });
      const { count: openCount, error: openError } = await supabase
        .from('vacancies')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'open');
      const { count: closedCount, error: closedError } = await supabase
        .from('vacancies')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'closed');

      if (totalError || openError || closedError) {
        console.error('Error fetching vacancy stats:', totalError || openError || closedError);
        return;
      }

      setVacanciesStats({
        total: totalCount || 0,
        open: openCount || 0,
        closed: closedCount || 0,
      });
    }

    async function fetchData() {
      const { count: applicantCount, error: applicantsError } = await supabase
        .from('applicant_profiles')
        .select('id', { count: 'exact', head: true });

      if (applicantsError) {
        console.error('Error fetching applicants data:', applicantsError);
      } else {
        setApplicantStats(applicantCount || 0);
      }

      const { count: companyCount, error: companiesError } = await supabase
        .from('companies')
        .select('id', { count: 'exact', head: true });

      if (companiesError) {
        console.error('Error fetching companies data:', companiesError);
      } else {
        setCompanyStats(companyCount || 0);
      }
    }

    fetchData();
    fetchVacancyStats();
  }, []);

  const vacancyData = [
    { name: 'Open Jobs', value: vacanciesStats.open },
    { name: 'Closed Jobs', value: vacanciesStats.closed },
  ];

  const chartOptions = {
    chart: {
      type: 'pie',
    },
    labels: vacancyData.map((item) => item.name),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const chartSeries = vacancyData.map((item) => item.value || 0);

  return (
    <div>
      <h1>Analytics Dashboard</h1>

      <div>
        <h2>Job Postings</h2>
        <p>Total Posts: {vacanciesStats.total}</p>
        <p>Total Open: {vacanciesStats.open}</p>
        <p>Total Closed: {vacanciesStats.closed}</p>

        <Chart options={chartOptions} series={chartSeries} type="pie" width={380} />
      </div>

      <div>
        <h2>Applicants</h2>
        <p>Total Applicants: {applicantStats}</p>
      </div>

      <div>
        <h2>Company Insights</h2>
        <p>Total Companies: {companyStats}</p>
      </div>
    </div>
  );
}


            // job_level - public, location, company
            // approved_datetime - Date posted
            // yearly_salary / month_salary / day_salary / hourly_rate
            // type_id (fulltime, partime, contract, gig)
            // Use these counts to update your state