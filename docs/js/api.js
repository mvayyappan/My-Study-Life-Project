// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ==========================================
// TOKEN MANAGEMENT
// ==========================================

function getToken() {
    return localStorage.getItem('authToken');
}

function setToken(token) {
    localStorage.setItem('authToken', token);
}

function removeToken() {
    localStorage.removeItem('authToken');
}

function isLoggedIn() {
    return !!getToken();
}

// ==========================================
// AUTH ENDPOINTS
// ==========================================

async function signup(email, password, full_name) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                full_name: full_name
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.detail || 'Signup failed' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful! Token length:', data.access_token.length);
            setToken(data.access_token);
            console.log('Token stored in localStorage');
            return { success: true, data: data };
        } else {
            console.error('Login failed:', data.detail);
            return { success: false, error: data.detail || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

function logout() {
    removeToken();
    return { success: true, data: null };
}

async function getCurrentUser() {
    const token = getToken();
    if (!token) {
        return { success: false, error: 'Not logged in' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me?token=${token}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.detail || 'Failed to get user' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// QUIZ ENDPOINTS
// ==========================================

async function getAllQuizzes() {
    try {
        const response = await fetch(`${API_BASE_URL}/quiz/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.detail || 'Failed to get quizzes' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getQuizWithQuestions(quizId) {
    try {
        const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.detail || 'Failed to get quiz' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function submitQuizAPI(quizId, answersDict) {
    const token = getToken();
    if (!token) {
        console.error('No token found in localStorage');
        return { success: false, error: 'Not logged in - please login again' };
    }

    console.log('Submitting quiz with token:', token.substring(0, 20) + '...');

    try {
        const response = await fetch(`${API_BASE_URL}/quiz/submit/${quizId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                quiz_id: quizId,
                answers: answersDict
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            console.error('Submit failed:', data);
            return { success: false, error: data.detail || 'Failed to submit quiz' };
        }
    } catch (error) {
        console.error('Submit error:', error);
        return { success: false, error: error.message };
    }
}

async function addQuestion(quizId, question_text, option_a, option_b, option_c, option_d, correct_answer) {
    const token = getToken();
    if (!token) {
        return { success: false, error: 'Not logged in' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                question_text: question_text,
                option_a: option_a,
                option_b: option_b,
                option_c: option_c,
                option_d: option_d,
                correct_answer: correct_answer
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.detail || 'Failed to add question' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// PROGRESS ENDPOINTS
// ==========================================

async function getUserProgress() {
    const token = getToken();
    if (!token) {
        return { success: false, error: 'Not logged in' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/progress/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.detail || 'Failed to get progress' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getQuizResult(quizId) {
    const token = getToken();
    if (!token) {
        return { success: false, error: 'Not logged in' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/progress/quiz/${quizId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.detail || 'Failed to get quiz result' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUserStats() {
    const token = getToken();
    if (!token) {
        return { success: false, error: 'Not logged in' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/progress/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data.detail || 'Failed to get stats' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}
