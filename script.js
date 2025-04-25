// script.js
document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const nextBtn = document.getElementById('nextBtn');
    const feedbackStep = document.getElementById('feedbackStep');
    const browseBtn = document.getElementById('browseBtn');
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Sidebar Toggle
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Modal and Navigation
    if (uploadBtn && uploadModal) {
        uploadBtn.addEventListener('click', () => {
            uploadModal.classList.remove('hidden');
        });
    }

    if (nextBtn && feedbackStep) {
        nextBtn.addEventListener('click', () => {
            uploadModal.classList.add('hidden');
            feedbackStep.classList.remove('hidden');
            // Simulate progress
            setTimeout(() => {
                updateProgressCircle(50);
            }, 500);
        });
    }

    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.docx';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file && file.size <= 10 * 1024 * 1024) {
                    document.getElementById('fileName').textContent = file.name;
                    const formData = new FormData();
                    formData.append('file', file);
                    fetch('http://localhost:5000/upload', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => alert(data.message || data.error))
                    .catch(error => alert('Error uploading file'));
                } else {
                    alert('File must be PDF/DOCX and under 10MB');
                }
            };
            input.click();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('text-00ffcc', 'font-semibold'));
            link.classList.add('text-00ffcc', 'font-semibold');
            if (sidebar) sidebar.classList.remove('open');
            if (uploadModal && !uploadModal.classList.contains('hidden')) {
                uploadModal.classList.add('hidden');
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            uploadModal.classList.add('hidden');
        }
    });

    // Suggestion Handling
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const li = btn.parentElement;
            if (btn.classList.contains('accept')) {
                li.classList.add('line-through', 'text-green-400');
            } else if (btn.classList.contains('reject')) {
                li.remove();
            }
        });
    });

    // Progress Circle Function (SVG-based, simplified)
    function updateProgressCircle(percent) {
        const circle = document.querySelector('.progress-circle svg circle');
        const circumference = 2 * Math.PI * 35; // Radius of 35
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
        document.querySelector('.progress-circle .value').textContent = `${percent}%`;
    }
});