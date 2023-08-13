document.addEventListener('DOMContentLoaded', function() {
  // Define constants for commonly used elements
  const visitDateInput = document.getElementById('visitDate');
  const timeSlotsCheckboxes = document.querySelectorAll('input[name="timeSlot"]');
  const ticketInputs = document.querySelectorAll('input[type="number"]');
  const summaryTable = document.getElementById('summaryTable');
 

  // Function to update the summary table
  function updateSummary() {
    const selectedDate = visitDateInput.value;
    const selectedTimeSlots = Array.from(timeSlotsCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    let timeFormat = "No time slots selected";

    if (selectedTimeSlots.length === 1) {
      // Format the selected time slot
      const [start, end, type] = selectedTimeSlots[0].split(' - ');
      const [startHour, startMinutes] = start.split(':');
      const [endHour, endMinutes] = end.split(':');
      const startAmPm = startHour >= 12 ? 'pm' : 'am';
      const endAmPm = endHour >= 12 ? 'pm' : 'am';
      const startHour12 = (startHour % 12) || 12;
      const endHour12 = (endHour % 12) || 12;

      if (startAmPm === 'pm' && endHour < startHour) {
        timeFormat = `${startHour12}.${startMinutes} ${startAmPm} - ${endHour12}.${endMinutes} am (${type})`;
      } else {
        timeFormat = `${startHour12}.${startMinutes} ${startAmPm} - ${endHour12}.${endMinutes} ${endAmPm} (${type})`;
      }
    } else if (selectedTimeSlots.length > 1) {
      // Format the selected time slots range
      const startTime = selectedTimeSlots[0].split(' - ')[0];
      const endTime = selectedTimeSlots[selectedTimeSlots.length - 1].split(' - ')[1];
      timeFormat = `${startTime} - ${endTime}`;
    }

    // Calculate total duration in hours
    const totalDuration = selectedTimeSlots.reduce((total, slot) => {
      const [start, end] = slot.split(' - ');
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      return total + (endHour - startHour);
    }, 0);

    // Update summary table elements
    document.getElementById('visitDateSummary').textContent = selectedDate;
    document.getElementById('timeSlotSummary').textContent = timeFormat;
    document.getElementById('durationSummary').textContent = `${totalDuration} hours (Normal: Peak)`;
  }

  // Function to calculate charges and update the summary table
  function calculateCharges() {
    // Parse input values
    const slAdultCount = parseInt(document.getElementById('slAdult').value);
    const slChildCount = parseInt(document.getElementById('slChild').value);
    const foreignerAdultCount = parseInt(document.getElementById('foreignerAdult').value);
    const foreignerChildCount = parseInt(document.getElementById('foreignerChild').value);
    const infantsCount = parseInt(document.getElementById('infants').value);

    // Calculate charges
    const slAdultCharge = slAdultCount * 4;
    const slChildCharge = slChildCount * 2;
    const foreignerAdultCharge = foreignerAdultCount * 10;
    const foreignerChildCharge = foreignerChildCount * 5;

    // Calculate total payable
    const totalPayable = slAdultCharge + slChildCharge + foreignerAdultCharge + foreignerChildCharge;

    // Update summary table with charges
    document.getElementById('slAdultCount').textContent = slAdultCount;
    document.getElementById('slChildCount').textContent = slChildCount;
    document.getElementById('foreignerAdultCount').textContent = foreignerAdultCount;
    document.getElementById('foreignerChildCount').textContent = foreignerChildCount;
    document.getElementById('infantsCount').textContent = infantsCount;
    document.getElementById('slAdultSummary').textContent = `$${slAdultCharge}`;
    document.getElementById('slChildSummary').textContent = `$${slChildCharge}`;
    document.getElementById('foreignerAdultSummary').textContent = `$${foreignerAdultCharge}`;
    document.getElementById('foreignerChildSummary').textContent = `$${foreignerChildCharge}`;
    document.getElementById('infantsSummary').textContent = '$0'; // Infants are free
    document.getElementById('totalPayableSummary').textContent = `$${totalPayable}`;

    // Enable or disable the continue button based on total payable
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.disabled = totalPayable <= 0;
  }

  function updateSummaryAndLocalStorage() {
  // Existing code for updating the summary table

  // Add the following code here to store the selected summary data in local storage
  const selectedTimeSlots = Array.from(timeSlotsCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

    // Store summary data in local storage
    const summaryData = {
      date: visitDateInput.value,
      timeSlots: Array.from(timeSlotsCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value),
      slAdult: parseInt(document.getElementById('slAdult').value),
      slChild: parseInt(document.getElementById('slChild').value),
      foreignerAdult: parseInt(document.getElementById('foreignerAdult').value),
      foreignerChild: parseInt(document.getElementById('foreignerChild').value),
      infants: parseInt(document.getElementById('infants').value)
    };
    localStorage.setItem('summaryData', JSON.stringify(summaryData));
  }

  // Event listener for date and time slot selection
  visitDateInput.addEventListener('change', updateSummaryAndLocalStorage);
  timeSlotsCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateSummaryAndLocalStorage);
  });

  // Event listener for ticket quantity changes
  ticketInputs.forEach(input => {
    input.addEventListener('change', updateSummaryAndLocalStorage);
  });

  // Check if there's already stored data in local storage and update the summary table accordingly
  const storedSummaryData = JSON.parse(localStorage.getItem('summaryData'));
  if (storedSummaryData) {
    visitDateInput.value = storedSummaryData.date;
    timeSlotsCheckboxes.forEach(checkbox => {
      checkbox.checked = storedSummaryData.timeSlots.includes(checkbox.value);
    });
    document.getElementById('slAdult').value = storedSummaryData.slAdult;
    document.getElementById('slChild').value = storedSummaryData.slChild;
    document.getElementById('foreignerAdult').value = storedSummaryData.foreignerAdult;
    document.getElementById('foreignerChild').value = storedSummaryData.foreignerChild;
    document.getElementById('infants').value = storedSummaryData.infants;

    updateSummary();
    calculateCharges();
  }
});

















