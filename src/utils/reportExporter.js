/**
 * Utility for exporting Attendance & Financial Reports in CSV and Printable PDF formats.
 */

/**
 * Downloads a CSV spreadsheet file of student attendance records.
 */
export function downloadReportCSV({ title, dateRange, records }) {
  const headers = [
    'Roll No',
    'Student Name',
    'Class Section',
    'Parent Phone',
    'Total Days',
    'Days Present',
    'Days Absent',
    'Days Leave',
    'Attendance Pct (%)',
    'Exam Eligibility Status'
  ];

  const csvRows = [
    [`"Schoolzz Academic Attendance Report"`],
    [`"Report Title: ${title}"`],
    [`"Date Range: ${dateRange}"`],
    [`"Generated On: ${new Date().toLocaleString()}"`],
    [],
    headers.map(h => `"${h}"`).join(',')
  ];

  records.forEach(st => {
    const isEligible = (st.attendancePct >= 80) ? 'ELIGIBLE (>=80%)' : 'WARNING (<80%)';
    const row = [
      `"${st.rollNo}"`,
      `"${st.name.replace(/"/g, '""')}"`,
      `"${st.className || ''}"`,
      `"${st.parentPhone || ''}"`,
      `"${(st.daysPresent || 0) + (st.daysAbsent || 0) + (st.daysLeave || 0)}"`,
      `"${st.daysPresent || 0}"`,
      `"${st.daysAbsent || 0}"`,
      `"${st.daysLeave || 0}"`,
      `"${st.attendancePct || 0}%"`,
      `"${isEligible}"`
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${dateRange.replace(/[^a-z0-9]/g, '_')}.csv`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Opens a formatted, printable PDF window for official school attendance reporting.
 */
export function downloadReportPDF({ title, schoolName = 'Sunshine International School', dateRange, metrics = {}, records = [], userRole = 'Teacher' }) {
  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (!printWindow) return;

  const totalStudents = records.length;
  const avgAttendance = totalStudents > 0
    ? Math.round(records.reduce((sum, r) => sum + (r.attendancePct || 0), 0) / totalStudents)
    : 0;

  const eligibleCount = records.filter(r => (r.attendancePct || 0) >= 80).length;
  const shortageCount = totalStudents - eligibleCount;

  const rowsHTML = records.map((st, idx) => {
    const isEligible = (st.attendancePct >= 80);
    return `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold;">#${st.rollNo}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${st.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #475569;">${st.className || 'Class Section'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #10b981; font-weight: bold;">${st.daysPresent || 0}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #ef4444; font-weight: bold;">${st.daysAbsent || 0}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #f59e0b; font-weight: bold;">${st.daysLeave || 0}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: 800; font-size: 13px;">${st.attendancePct || 0}%</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; background-color: ${isEligible ? '#d1fae5' : '#fee2e2'}; color: ${isEligible ? '#065f46' : '#991b1b'};">
            ${isEligible ? '✓ ELIGIBLE (≥80%)' : '⚠️ SHORTAGE (<80%)'}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — ${schoolName}</title>
        <style>
          body { font-family: 'Roboto', 'Segoe UI', Tahoma, sans-serif; margin: 30px; color: #0f172a; }
          .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1b4d3e; padding-bottom: 15px; margin-bottom: 20px; }
          .logo-title { display: flex; align-items: center; gap: 12px; }
          .school-badge { background: #1b4d3e; color: white; padding: 8px 14px; border-radius: 12px; font-weight: bold; font-size: 18px; }
          .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 25px; }
          .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 12px; text-align: center; }
          .metric-value { font-size: 20px; font-weight: 900; color: #1b4d3e; margin-top: 4px; }
          .metric-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th { background: #1b4d3e; color: white; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #1b4d3e; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <div class="logo-title">
            <div class="school-badge">Schoolzz</div>
            <div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #1b4d3e;">${schoolName}</h1>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">Official Student Attendance & Academic Performance Report</p>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; font-weight: bold; color: #0f172a;">${title}</div>
            <div style="font-size: 11px; color: #64748b;">Date Range: ${dateRange}</div>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Total Enrolled</div>
            <div class="metric-value">${totalStudents}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Class Average</div>
            <div class="metric-value" style="color: #10b981;">${avgAttendance}%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Exam Eligible</div>
            <div class="metric-value" style="color: #059669;">${eligibleCount}</div>
          </div>
          <div class="metric-card">
            <div class="metric-card-label" style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold;">Shortage Warning</div>
            <div class="metric-value" style="color: #dc2626;">${shortageCount}</div>
          </div>
        </div>

        <h3 style="font-size: 14px; margin-bottom: 8px; color: #0f172a;">Student Roster & Attendance Breakdown</h3>
        <table>
          <thead>
            <tr>
              <th>Roll #</th>
              <th>Student Name</th>
              <th>Class Section</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Leave</th>
              <th>Attendance %</th>
              <th>Exam Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>

        <div class="footer">
          <div>Report Generated by Schoolzz ERP System (${userRole} Access)</div>
          <div>Page 1 of 1 • Date: ${new Date().toLocaleDateString()}</div>
        </div>

        <script>
          setTimeout(() => {
            window.print();
          }, 600);
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
