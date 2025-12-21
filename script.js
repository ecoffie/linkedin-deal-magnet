// Handle Contract Finder priority filter
document.addEventListener('DOMContentLoaded', () => {
    const priorityFilter = document.getElementById('priority-filter');
    const findContractsBtn = document.getElementById('find-contracts-btn');
    
    if (priorityFilter && findContractsBtn) {
        findContractsBtn.addEventListener('click', (e) => {
            const priority = priorityFilter.value;
            if (priority) {
                // Store priority filter in sessionStorage to use on contract finder page
                sessionStorage.setItem('priorityFilter', priority);
            }
            // Let the link navigate normally
        });
    }
});

// Form handlers
document.addEventListener('DOMContentLoaded', function() {
    const form1 = document.getElementById('audit-form');
    const form2 = document.getElementById('audit-form-bottom');
    const urlInput1 = document.getElementById('linkedin-url');
    const urlInput2 = document.getElementById('linkedin-url-bottom');

    function handleSubmit(e) {
        e.preventDefault();
        const url = e.target === form1 ? urlInput1.value : urlInput2.value;
        runAudit(url);
    }

    form1?.addEventListener('submit', handleSubmit);
    form2?.addEventListener('submit', handleSubmit);

    // Sync inputs
    urlInput1?.addEventListener('input', (e) => {
        if (urlInput2) urlInput2.value = e.target.value;
    });
    urlInput2?.addEventListener('input', (e) => {
        if (urlInput1) urlInput1.value = e.target.value;
    });
});

// Run audit function
async function runAudit(linkedinUrl) {
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
        alert('Please enter a valid LinkedIn URL');
        return;
    }

    const modal = document.getElementById('audit-modal');
    const content = document.getElementById('audit-content');

    // Show loading state
    modal.classList.remove('hidden');
    content.innerHTML = `
        <div class="p-8 md:p-12">
            <div class="text-center">
                <div class="spinner mb-6"></div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Analyzing Your Profile...</h2>
                <p class="text-gray-600">This will take about 60 seconds</p>
            </div>
        </div>
    `;

    try {
        const response = await fetch('/api/audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: linkedinUrl }),
        });

        if (!response.ok) {
            throw new Error('Failed to analyze profile');
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error:', error);
        content.innerHTML = `
            <div class="p-8 md:p-12">
                <div class="text-center">
                    <div class="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
                    <p class="text-gray-600 mb-6">${error.message}</p>
                    <button onclick="document.getElementById('audit-modal').classList.add('hidden')" 
                            class="bg-linkedin-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-linkedin-dark transition">
                        Close
                    </button>
                </div>
            </div>
        `;
    }
}

// Display audit results
function displayResults(data) {
    const content = document.getElementById('audit-content');
    
    const score = data.score || 0;
    const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
    const scoreBg = score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100';

    content.innerHTML = `
        <div class="p-8 md:p-12">
            <!-- Header -->
            <div class="flex justify-between items-start mb-8">
                <div>
                    <h2 class="text-4xl font-bold text-gray-900 mb-2">Your LinkedIn Audit Results</h2>
                    <p class="text-gray-600">Based on AI analysis of your profile</p>
                </div>
                <button onclick="document.getElementById('audit-modal').classList.add('hidden')" 
                        class="text-gray-400 hover:text-gray-600 text-2xl">
                    ×
                </button>
            </div>

            <!-- Score -->
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-blue-200">
                <div class="text-center">
                    <div class="inline-block ${scoreBg} rounded-full p-8 mb-4">
                        <div class="text-6xl font-bold ${scoreColor}">${score}</div>
                        <div class="text-lg text-gray-600 mt-2">out of 100</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Profile Score</h3>
                    <p class="text-gray-600 max-w-2xl mx-auto">
                        ${score >= 80 ? 'Excellent! Your profile is well-optimized.' : 
                          score >= 60 ? 'Good start, but there\'s room for improvement.' : 
                          'Your profile needs significant optimization to attract deals.'}
                    </p>
                </div>
            </div>

            <!-- Headline Comparison -->
            ${data.currentHeadline || data.aiHeadline ? `
            <div class="bg-white rounded-xl p-6 mb-8 border border-gray-200 shadow-sm">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">Headline Optimization</h3>
                <div class="space-y-4">
                    ${data.currentHeadline ? `
                    <div>
                        <div class="text-sm font-semibold text-gray-500 mb-2">Current Headline</div>
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p class="text-gray-700">${escapeHtml(data.currentHeadline)}</p>
                        </div>
                    </div>
                    ` : ''}
                    ${data.aiHeadline ? `
                    <div>
                        <div class="text-sm font-semibold text-green-600 mb-2">AI-Optimized Headline</div>
                        <div class="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                            <p class="text-gray-900 font-medium">${escapeHtml(data.aiHeadline)}</p>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
            ` : ''}

            <!-- Fixes -->
            <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">${data.fixes?.length || 20} Personalized Fixes</h3>
                <div class="space-y-4">
                    ${(data.fixes || []).map((fix, index) => `
                        <div class="fix-card bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <div class="flex items-start gap-4">
                                <div class="flex-shrink-0 w-8 h-8 bg-linkedin-blue text-white rounded-full flex items-center justify-center font-bold">
                                    ${index + 1}
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h4 class="font-bold text-gray-900">${escapeHtml(fix.title || fix.category || 'Improvement')}</h4>
                                        ${fix.priority ? `<span class="badge badge-${fix.priority}">${fix.priority}</span>` : ''}
                                    </div>
                                    <p class="text-gray-600 mb-3">${escapeHtml(fix.description || fix.fix || '')}</p>
                                    ${fix.tips ? `
                                    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <div class="text-sm font-semibold text-blue-900 mb-2">💡 Tip:</div>
                                        <p class="text-sm text-blue-800">${escapeHtml(fix.tips)}</p>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Upsell -->
            <div class="bg-gradient-to-r from-linkedin-blue to-purple-600 rounded-2xl p-8 text-white">
                <h3 class="text-3xl font-bold mb-4">Ready to Implement These Fixes?</h3>
                <p class="text-lg mb-6 text-blue-100">
                    Get step-by-step guidance and monthly content to keep your profile optimized
                </p>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                        <h4 class="text-2xl font-bold mb-2">Full Fix Guide</h4>
                        <div class="text-4xl font-bold mb-2">$97</div>
                        <div class="text-blue-100 mb-4">One-time payment</div>
                        <ul class="space-y-2 mb-6 text-sm">
                            <li>✓ Step-by-step implementation guide</li>
                            <li>✓ All 20+ fixes explained in detail</li>
                            <li>✓ Banner and image templates</li>
                            <li>✓ Case study templates</li>
                            <li>✓ Email support</li>
                        </ul>
                        <button onclick="checkoutFullFix('${data.sessionId || ''}')" 
                                class="w-full bg-white text-linkedin-blue font-bold py-3 rounded-lg hover:bg-gray-100 transition">
                            Get Full Fix Guide
                        </button>
                    </div>
                    <div class="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                        <h4 class="text-2xl font-bold mb-2">Content Engine</h4>
                        <div class="text-4xl font-bold mb-2">$47<span class="text-lg">/mo</span></div>
                        <div class="text-blue-100 mb-4">Monthly subscription</div>
                        <ul class="space-y-2 mb-6 text-sm">
                            <li>✓ Everything in Full Fix Guide</li>
                            <li>✓ 4 AI-generated posts per month</li>
                            <li>✓ Monthly profile re-audits</li>
                            <li>✓ Content calendar</li>
                            <li>✓ Priority support</li>
                        </ul>
                        <button onclick="checkoutContentEngine('${data.sessionId || ''}')" 
                                class="w-full bg-white text-linkedin-blue font-bold py-3 rounded-lg hover:bg-gray-100 transition">
                            Start Content Engine
                        </button>
                    </div>
                </div>
                <p class="text-center mt-6 text-sm text-blue-100">
                    Or continue with free recommendations above
                </p>
            </div>
        </div>
    `;
}

// Stripe checkout functions
async function checkoutFullFix(sessionId) {
    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: 'price_full_fix', // Replace with your Stripe price ID
                mode: 'payment',
                successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}?canceled=true`,
            }),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to start checkout. Please try again.');
    }
}

async function checkoutContentEngine(sessionId) {
    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: 'price_content_engine', // Replace with your Stripe price ID
                mode: 'subscription',
                successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}?canceled=true`,
            }),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to start checkout. Please try again.');
    }
}

// Utility function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}






