class AdminDashboard {
    constructor() {
        this.reports = this.loadReports();
        this.filteredReports = [...this.reports];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderStats();
        this.renderReports();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.filterReports(e.target.value, document.getElementById('filterSelect').value);
        });

        // Filter functionality
        const filterSelect = document.getElementById('filterSelect');
        filterSelect.addEventListener('change', (e) => {
            this.filterReports(searchInput.value, e.target.value);
        });

        // Refresh functionality
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.addEventListener('click', () => {
            this.refreshData();
        });

        // Clear data functionality
        const clearBtn = document.getElementById('clearData');
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                this.clearAllData();
            }
        });

        // Listen for new reports from client page
        window.addEventListener('storage', (e) => {
            if (e.key === 'forestWatchReports') {
                console.log('New data received from client!');
                this.refreshData();
                this.showNewDataNotification();
            }
        });

        // Auto-refresh every 5 seconds
        setInterval(() => {
            this.refreshData();
        }, 5000);
    }

    loadReports() {
        try {
            // First try to load from API
            this.loadReportsFromAPI();
            
            // Also load from localStorage as backup
            const stored = localStorage.getItem('forestWatchReports');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading reports:', error);
            return [];
        }
    }

    loadReportsFromAPI() {
        fetch('api/reports.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.data) {
                    // Merge API data with localStorage data
                    const localReports = JSON.parse(localStorage.getItem('forestWatchReports') || '[]');
                    const allReports = [...localReports, ...data.data];
                    
                    // Remove duplicates based on ID
                    const uniqueReports = allReports.filter((report, index, self) => 
                        index === self.findIndex(r => r.id === report.id)
                    );
                    
                    // Sort by timestamp (newest first)
                    uniqueReports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    
                    // Update localStorage
                    localStorage.setItem('forestWatchReports', JSON.stringify(uniqueReports));
                    
                    // Update display
                    this.reports = uniqueReports;
                    this.filteredReports = [...this.reports];
                    this.renderStats();
                    this.renderReports();
                    
                    console.log('Reports loaded from API:', uniqueReports.length);
                }
            })
            .catch(error => {
                console.error('Error loading reports from API:', error);
                // Fallback to localStorage only
                const stored = localStorage.getItem('forestWatchReports');
                this.reports = stored ? JSON.parse(stored) : [];
                this.filteredReports = [...this.reports];
                this.renderStats();
                this.renderReports();
            });
    }

    saveReports() {
        try {
            localStorage.setItem('forestWatchReports', JSON.stringify(this.reports));
        } catch (error) {
            console.error('Error saving reports:', error);
        }
    }

    filterReports(searchTerm, filterType) {
        this.filteredReports = this.reports.filter(report => {
            // Search filter
            const matchesSearch = !searchTerm || 
                report.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.id.toLowerCase().includes(searchTerm.toLowerCase());

            // Type filter
            let matchesFilter = true;
            switch (filterType) {
                case 'with-images':
                    matchesFilter = report.hasImage;
                    break;
                case 'with-location':
                    matchesFilter = report.hasLocation;
                    break;
                case 'today':
                    const today = new Date().toDateString();
                    matchesFilter = new Date(report.timestamp).toDateString() === today;
                    break;
                case 'all':
                default:
                    matchesFilter = true;
                    break;
            }

            return matchesSearch && matchesFilter;
        });

        this.renderReports();
    }

    renderStats() {
        const totalReports = this.reports.length;
        const reportsWithImages = this.reports.filter(r => r.hasImage).length;
        const reportsWithLocation = this.reports.filter(r => r.hasLocation).length;
        const today = new Date().toDateString();
        const todayReports = this.reports.filter(r => 
            new Date(r.timestamp).toDateString() === today
        ).length;

        document.getElementById('totalReports').textContent = totalReports;
        document.getElementById('reportsWithImages').textContent = reportsWithImages;
        document.getElementById('reportsWithLocation').textContent = reportsWithLocation;
        document.getElementById('todayReports').textContent = todayReports;
    }

    renderReports() {
        const reportsList = document.getElementById('reportsList');
        
        if (this.filteredReports.length === 0) {
            reportsList.innerHTML = `
                <div class="no-reports">
                    <p>No reports found matching your criteria.</p>
                </div>
            `;
            return;
        }

        reportsList.innerHTML = this.filteredReports.map((report, index) => {
            const isNew = this.isNewReport(report);
            return `
                <div class="report-card ${isNew ? 'new-report' : ''}" data-report-id="${report.id}">
                    <div class="report-header">
                        <span class="report-id">Report #${report.id}</span>
                        <span class="report-date">${this.formatDate(report.timestamp)}</span>
                        ${isNew ? '<span class="new-badge">NEW</span>' : ''}
                    </div>
                    <div class="report-message">${this.escapeHtml(report.message)}</div>
                    ${report.hasImage ? `
                        <div class="report-image">
                            <img src="${report.imageData}" alt="Report image" 
                                 onclick="adminDashboard.showImageModal('${report.imageData}')" />
                        </div>
                    ` : ''}
                    ${report.hasLocation ? `
                        <div class="report-location">
                            <div class="location-info">
                                <span class="location-icon">📍</span>
                                <span class="location-coords">${report.location.latitude.toFixed(6)}, ${report.location.longitude.toFixed(6)}</span>
                                <button class="btn-view-map" onclick="adminDashboard.showMapModal(${report.location.latitude}, ${report.location.longitude})">
                                    View on Map
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    isNewReport(report) {
        const reportTime = new Date(report.timestamp).getTime();
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        return reportTime > fiveMinutesAgo;
    }

    showImageModal(imageSrc) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.image-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</button>
                <img src="${imageSrc}" alt="Full size image" />
            </div>
        `;
        
        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }

    showMapModal(latitude, longitude) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.map-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'map-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Location on Map</h3>
                    <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="location-details">
                        <p><strong>Coordinates:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
                        <p><strong>Google Maps:</strong> <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">Open in Google Maps</a></p>
                    </div>
                    <div class="map-container">
                        <iframe 
                            src="https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed"
                            width="100%" 
                            height="400" 
                            style="border:0;" 
                            allowfullscreen="" 
                            loading="lazy" 
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                        <div class="map-fallback">
                            <p>📍 Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
                            <p><a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank" class="map-link">🗺️ Open in Google Maps</a></p>
                            <p><a href="https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15" target="_blank" class="map-link">🌍 Open in OpenStreetMap</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }

    refreshData() {
        const oldCount = this.reports.length;
        
        // Load from API first
        this.loadReportsFromAPI();
        
        // Also check localStorage
        const stored = localStorage.getItem('forestWatchReports');
        if (stored) {
            this.reports = JSON.parse(stored);
            this.filteredReports = [...this.reports];
            this.renderStats();
            this.renderReports();
        }
        
        this.updateLastRefreshTime();
        
        const newCount = this.reports.length;
        if (newCount > oldCount) {
            console.log(`New reports detected! Total: ${newCount}`);
            this.showNewDataNotification();
        }
    }

    updateLastRefreshTime() {
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            lastUpdate.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        }
    }

    showNewDataNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1001;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = '🆕 New report received!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    clearAllData() {
        this.reports = [];
        this.filteredReports = [];
        this.saveReports();
        this.renderStats();
        this.renderReports();
        
        // Show success message
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--green-700);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1001;
            font-weight: 600;
        `;
        notification.textContent = 'All data cleared successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize dashboard when page loads
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});
