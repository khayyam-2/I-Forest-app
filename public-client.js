document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const form = document.getElementById('reportForm');
  const input = document.getElementById('reportInput');
  const messageInput = document.getElementById('messageInput');
  const selectImageBtn = document.getElementById('selectImageBtn');
  const sendImageBtn = document.getElementById('sendImageBtn');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const imagePlaceholder = document.getElementById('imagePlaceholder');
  const popupModal = document.getElementById('popupModal');
  const closePopup = document.getElementById('closePopup');
  const popupOkBtn = document.getElementById('popupOkBtn');
  const popupTitle = document.getElementById('popupTitle');
  const popupMessage = document.getElementById('popupMessage');
  const locationStatus = document.getElementById('locationStatus');
  const locationIcon = document.getElementById('locationIcon');
  const locationText = document.getElementById('locationText');
  const getLocationBtn = document.getElementById('getLocationBtn');
  const locationWarning = document.getElementById('locationWarning');

  // State variables
  let selectedImage = null;
  let selectedImageName = '';
  let selectedImageData = null;
  let currentLocation = null;
  let locationPermissionGranted = false;

  // GPS Location Functions
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      updateLocationStatus('error', 'Geolocation is not supported by this browser.');
      showLocationWarning();
      return;
    }

    updateLocationStatus('loading', 'Getting your location...');
    getLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      function(position) {
        currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        
        locationPermissionGranted = true;
        updateLocationStatus('success', `Location: ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`);
        getLocationBtn.disabled = false;
        hideLocationWarning();
        
        showToast('success', 'Location Captured!', 'GPS coordinates have been successfully captured.');
        console.log('Location captured:', currentLocation);
      },
      function(error) {
        let errorMessage = 'Unable to get your location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        
        updateLocationStatus('error', errorMessage);
        getLocationBtn.disabled = false;
        showLocationWarning();
        showToast('error', 'Location Error', errorMessage);
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }

  function updateLocationStatus(status, message) {
    locationText.textContent = message;
    locationStatus.className = `location-status ${status}`;
    
    switch(status) {
      case 'loading':
        locationIcon.textContent = '⏳';
        break;
      case 'success':
        locationIcon.textContent = '✅';
        break;
      case 'error':
        locationIcon.textContent = '❌';
        break;
      default:
        locationIcon.textContent = '📍';
    }
  }

  function showLocationWarning() {
    locationWarning.style.display = 'block';
  }

  function hideLocationWarning() {
    locationWarning.style.display = 'none';
  }

  // Get location button event listener
  getLocationBtn.addEventListener('click', getCurrentLocation);

  // Auto-get location on page load
  setTimeout(() => {
    if (!locationPermissionGranted) {
      getCurrentLocation();
    }
  }, 1000);

  // Image Selection
  selectImageBtn.addEventListener('click', function() {
    imageInput.click();
  });

  imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          selectedImage = e.target.result;
          selectedImageName = file.name;
          selectedImageData = {
            src: e.target.result,
            name: file.name,
            type: 'uploaded',
            size: file.size,
            timestamp: new Date().toISOString(),
            location: currentLocation,
            hasLocation: !!currentLocation
          };
          
          updateImagePreview(selectedImage, file.name);
          sendImageBtn.disabled = false;
          
          showToast('success', 'Image Uploaded!', `"${file.name}" has been uploaded successfully.`);
          console.log('Image uploaded:', selectedImageData);
        };
        reader.readAsDataURL(file);
      } else {
        showPopup('Error', 'Please select a valid image file.');
      }
    }
  });

  // Update image preview
  function updateImagePreview(src, name) {
    imagePreview.src = src;
    imagePreview.alt = name;
    imagePreview.style.display = 'block';
    imagePlaceholder.style.display = 'none';
    
    imagePreview.style.opacity = '0';
    imagePreview.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      imagePreview.style.transition = 'all 0.3s ease';
      imagePreview.style.opacity = '1';
      imagePreview.style.transform = 'scale(1)';
    }, 100);
  }

  // Send Image Button
  sendImageBtn.addEventListener('click', function() {
    if (selectedImage && selectedImageData) {
      if (!locationPermissionGranted) {
        showPopup('Location Required', 'Please allow location access before sending the image. GPS coordinates are required for forest monitoring.');
        return;
      }

      const originalText = this.textContent;
      this.textContent = 'Sending...';
      this.disabled = true;
      
      setTimeout(() => {
        // Update image data with sent status
        selectedImageData.sent = true;
        selectedImageData.sentAt = new Date().toISOString();
        
        // Create standalone image report for admin page
        const imageReport = {
          id: generateReportId(),
          timestamp: new Date().toISOString(),
          message: `Image sent: ${selectedImageName}\nLocation: ${selectedImageData.location.latitude.toFixed(6)}, ${selectedImageData.location.longitude.toFixed(6)}`,
          hasImage: true,
          imageData: selectedImageData.src,
          type: 'image-only',
          imageName: selectedImageName,
          imageType: selectedImageData.type,
          imageSize: selectedImageData.size,
          location: selectedImageData.location,
          hasLocation: selectedImageData.hasLocation
        };
        
        // Store image report in admin format
        storeImageReport(imageReport);
        
        // Show success message
        const message = `Photo "${selectedImageName}" has been sent successfully!\n\n` +
                       `Location: ${selectedImageData.location.latitude.toFixed(6)}, ${selectedImageData.location.longitude.toFixed(6)}\n` +
                       `Sent at: ${new Date().toLocaleString()}\n\n` +
                       `The photo and location are now visible in the admin dashboard.`;
        
        showPopup('Success', message);
        showToast('success', 'Photo Sent!', `"${selectedImageName}" has been sent to admin dashboard.`);
        
        // Reset button
        this.textContent = originalText;
        this.disabled = false;
        
        console.log('Image sent successfully:', selectedImageData);
      }, 1500);
    } else {
      showPopup('Error', 'Please select a photo first.');
    }
  });

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const mobileValue = (input.value || '').trim();
    const messageValue = (messageInput.value || '').trim();
    
    if (!mobileValue) {
      showPopup('Error', 'Please enter your mobile number and describe what you see.');
      input.focus();
      return;
    }

    if (!locationPermissionGranted) {
      showPopup('Location Required', 'Please allow location access before submitting the report. GPS coordinates are required for forest monitoring.');
      return;
    }

    // Prepare submission data
    const submissionData = {
      mobile: mobileValue,
      message: messageValue,
      image: selectedImageData || null,
      location: currentLocation,
      hasLocation: !!currentLocation,
      timestamp: new Date().toISOString()
    };

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Simulate submission process
    setTimeout(() => {
      // Store submission data
      storeSubmissionData(submissionData);
      
      // Show success message
      const successMessage = `Report submitted successfully!\n\n` +
                           `Mobile: ${submissionData.mobile}\n` +
                           `Message: ${submissionData.message || 'No additional message'}\n` +
                           `Photo: ${submissionData.image ? submissionData.image.name : 'No photo attached'}\n` +
                           `Location: ${submissionData.location.latitude.toFixed(6)}, ${submissionData.location.longitude.toFixed(6)}\n` +
                           `Time: ${new Date().toLocaleString()}`;
      
      showPopup('Success', successMessage);
      showToast('success', 'Report Submitted!', 'Your report has been submitted successfully and will appear in the admin dashboard.');
      
      // Reset form
      form.reset();
      resetImageSelection();
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      console.log('Report submitted:', submissionData);
    }, 1000);
  });

  // Store submission data
  function storeSubmissionData(submissionData) {
    try {
      // Create report in the format expected by admin page
      const report = {
        id: generateReportId(),
        timestamp: new Date().toISOString(),
        message: submissionData.mobile + (submissionData.message ? '\n\nAdditional Message: ' + submissionData.message : '') + `\n\nLocation: ${submissionData.location.latitude.toFixed(6)}, ${submissionData.location.longitude.toFixed(6)}`,
        hasImage: !!submissionData.image,
        imageData: submissionData.image ? submissionData.image.src : null,
        location: submissionData.location,
        hasLocation: submissionData.hasLocation
      };

      // Store in the format expected by admin page
      let reports = JSON.parse(localStorage.getItem('forestWatchReports') || '[]');
      reports.push(report);
      
      // Keep only last 100 reports
      if (reports.length > 100) {
        reports = reports.slice(-100);
      }
      
      localStorage.setItem('forestWatchReports', JSON.stringify(reports));
      
      // Trigger storage event for admin page
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'forestWatchReports',
        newValue: JSON.stringify(reports)
      }));
      
      console.log('Report stored. Total reports:', reports.length);
    } catch (error) {
      console.error('Error storing report:', error);
    }
  }

  // Store image report
  function storeImageReport(imageReport) {
    try {
      let reports = JSON.parse(localStorage.getItem('forestWatchReports') || '[]');
      reports.push(imageReport);
      
      if (reports.length > 100) {
        reports = reports.slice(-100);
      }
      
      localStorage.setItem('forestWatchReports', JSON.stringify(reports));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'forestWatchReports',
        newValue: JSON.stringify(reports)
      }));
      
      console.log('Image report stored. Total reports:', reports.length);
    } catch (error) {
      console.error('Error storing image report:', error);
    }
  }

  // Generate unique report ID
  function generateReportId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `FW${timestamp}${random}`.toUpperCase();
  }

  // Reset image selection
  function resetImageSelection() {
    selectedImage = null;
    selectedImageName = '';
    selectedImageData = null;
    imagePreview.style.display = 'none';
    imagePlaceholder.style.display = 'flex';
    sendImageBtn.disabled = true;
    imageInput.value = '';
  }

  // Popup Modal Functions
  function showPopup(title, message) {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popupModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function hidePopup() {
    popupModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  closePopup.addEventListener('click', hidePopup);
  popupOkBtn.addEventListener('click', hidePopup);

  // Close popup when clicking outside
  popupModal.addEventListener('click', function(e) {
    if (e.target === popupModal) {
      hidePopup();
    }
  });

  // Toast Notification System
  function showToast(type, title, message, duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
      <div class="toast-progress animate"></div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, duration);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    });
  }

  // Initialize the app
  console.log('Forest Watch Public Client initialized successfully!');
});
