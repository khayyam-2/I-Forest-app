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
  const imageModal = document.getElementById('imageModal');
  const closePopup = document.getElementById('closePopup');
  const closeImageModal = document.getElementById('closeImageModal');
  const popupOkBtn = document.getElementById('popupOkBtn');
  const popupTitle = document.getElementById('popupTitle');
  const popupMessage = document.getElementById('popupMessage');
  const customImageInput = document.getElementById('customImageInput');

  // State variables
  let selectedImage = null;
  let selectedImageName = '';
  let selectedImageData = null;

  // Image Selection Modal
  selectImageBtn.addEventListener('click', function() {
    imageModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  closeImageModal.addEventListener('click', function() {
    imageModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // Close modal when clicking outside
  imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
      imageModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Handle image option selection
  const imageOptions = document.querySelectorAll('.image-option');
  imageOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove previous selection
      imageOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Add selection to current option
      this.classList.add('selected');
      
      // Get the image source and name
      const img = this.querySelector('img');
      const imageName = this.getAttribute('data-image');
      
      // Set selected image data
      selectedImage = img.src;
      selectedImageName = imageName;
      selectedImageData = {
        src: img.src,
        name: imageName,
        type: 'sample',
        timestamp: new Date().toISOString()
      };
      
      // Update preview
      updateImagePreview(selectedImage, imageName);
      
      // Close modal
      imageModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      // Enable send button
      sendImageBtn.disabled = false;
      
      // Store image data automatically
      storeImageData(selectedImageData);
      
      console.log('Image selected:', selectedImageData);
    });
  });

  // Handle custom image upload
  customImageInput.addEventListener('change', function(e) {
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
            timestamp: new Date().toISOString()
          };
          
          updateImagePreview(selectedImage, file.name);
          sendImageBtn.disabled = false;
          
          // Close modal
          imageModal.style.display = 'none';
          document.body.style.overflow = 'auto';
          
          // Store image data automatically
          storeImageData(selectedImageData);
          
          console.log('Custom image uploaded:', selectedImageData);
        };
        reader.readAsDataURL(file);
      } else {
        showPopup('Error', 'Please select a valid image file.');
      }
    }
  });

  // Store image data automatically
  function storeImageData(imageData) {
    try {
      // Get existing stored images
      let storedImages = JSON.parse(localStorage.getItem('forestWatchImages') || '[]');
      
      // Add new image data
      storedImages.push(imageData);
      
      // Keep only last 50 images to prevent storage overflow
      if (storedImages.length > 50) {
        storedImages = storedImages.slice(-50);
      }
      
      // Store back to localStorage
      localStorage.setItem('forestWatchImages', JSON.stringify(storedImages));
      
      console.log('Image stored successfully. Total stored images:', storedImages.length);
    } catch (error) {
      console.error('Error storing image data:', error);
    }
  }

  // Send Image Button with enhanced functionality
  sendImageBtn.addEventListener('click', function() {
    if (selectedImage && selectedImageData) {
      const originalText = this.textContent;
      this.textContent = 'Sending...';
      this.disabled = true;
      
      // Simulate sending process
      setTimeout(() => {
        // Update image data with sent status
        selectedImageData.sent = true;
        selectedImageData.sentAt = new Date().toISOString();
        
        // Store updated data
        storeImageData(selectedImageData);
        
        // Show success message with details
        const message = `Image "${selectedImageName}" has been sent successfully!\n\n` +
                       `Type: ${selectedImageData.type}\n` +
                       `Size: ${selectedImageData.size ? formatFileSize(selectedImageData.size) : 'Sample Image'}\n` +
                       `Sent at: ${new Date().toLocaleString()}`;
        
        showPopup('Success', message);
        
        // Reset button
        this.textContent = originalText;
        this.disabled = false;
        
        // Don't reset image selection - keep it for form submission
        console.log('Image sent successfully:', selectedImageData);
      }, 1500);
    } else {
      showPopup('Error', 'Please select an image first.');
    }
  });

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Update image preview with better styling
  function updateImagePreview(src, name) {
    imagePreview.src = src;
    imagePreview.alt = name;
    imagePreview.style.display = 'block';
    imagePlaceholder.style.display = 'none';
    
    // Add some animation
    imagePreview.style.opacity = '0';
    imagePreview.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      imagePreview.style.transition = 'all 0.3s ease';
      imagePreview.style.opacity = '1';
      imagePreview.style.transform = 'scale(1)';
    }, 100);
  }

  // Reset image selection
  function resetImageSelection() {
    selectedImage = null;
    selectedImageName = '';
    selectedImageData = null;
    imagePreview.style.display = 'none';
    imagePlaceholder.style.display = 'flex';
    sendImageBtn.disabled = true;
    imageOptions.forEach(opt => opt.classList.remove('selected'));
    customImageInput.value = '';
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

  // Enhanced form submission with image data
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const mobileValue = (input.value || '').trim();
    const messageValue = (messageInput.value || '').trim();
    
    if (!mobileValue) {
      showPopup('Error', 'Please enter a mobile number with your message.');
      input.focus();
      return;
    }

    // Prepare submission data
    const submissionData = {
      mobile: mobileValue,
      message: messageValue,
      image: selectedImageData || null,
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
                           `Image: ${submissionData.image ? submissionData.image.name : 'No image attached'}\n` +
                           `Time: ${new Date().toLocaleString()}`;
      
      showPopup('Success', successMessage);
      
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
      let submissions = JSON.parse(localStorage.getItem('forestWatchSubmissions') || '[]');
      submissions.push(submissionData);
      
      // Keep only last 100 submissions
      if (submissions.length > 100) {
        submissions = submissions.slice(-100);
      }
      
      localStorage.setItem('forestWatchSubmissions', JSON.stringify(submissions));
      console.log('Submission stored. Total submissions:', submissions.length);
    } catch (error) {
      console.error('Error storing submission:', error);
    }
  }

  // Add interactive effects
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = 'scale(1)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
      if (popupModal.style.display === 'block') {
        hidePopup();
      }
      if (imageModal.style.display === 'block') {
        imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    }
    
    // Enter key to submit form (when not in textarea)
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      if (e.target === input || e.target === messageInput) {
        form.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Initialize the app
  console.log('Forest Watch App initialized successfully!');
  console.log('Stored images:', JSON.parse(localStorage.getItem('forestWatchImages') || '[]').length);
  console.log('Stored submissions:', JSON.parse(localStorage.getItem('forestWatchSubmissions') || '[]').length);
});


