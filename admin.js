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
                this.reports = this.loadReports();
                this.filteredReports = [...this.reports];
                this.renderStats();
                this.renderReports();
            }
        });
    }

    loadReports() {
        try {
            const stored = localStorage.getItem('forestWatchReports');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading reports:', error);
            return [];
        }
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
        const today = new Date().toDateString();
        const todayReports = this.reports.filter(r => 
            new Date(r.timestamp).toDateString() === today
        ).length;

        document.getElementById('totalReports').textContent = totalReports;
        document.getElementById('reportsWithImages').textContent = reportsWithImages;
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

        reportsList.innerHTML = this.filteredReports.map(report => `
            <div class="report-card">
                <div class="report-header">
                    <span class="report-id">Report #${report.id}</span>
                    <span class="report-date">${this.formatDate(report.timestamp)}</span>
                </div>
                <div class="report-message">${this.escapeHtml(report.message)}</div>
                ${report.hasImage ? `
                    <div class="report-image">
                        <img src="${report.imageData}" alt="Report image" 
                             onclick="adminDashboard.showImageModal('${report.imageData}')" />
                    </div>
                ` : ''}
            </div>
        `).join('');
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
            <img src="${imageSrc}" alt="Full size image" />
        `;
        
        // Close on click
        modal.addEventListener('click', () => {
            modal.remove();
        });

        document.body.appendChild(modal);
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
