// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// Global state
let currentUser = null;
let classes = [];
let bookings = [];
let wods = [];
let users = [];

// DOM Elements
const tabButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadInitialData();
    setupEventListeners();
});

// Tab Navigation
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Update active tab button
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    // Load data for the active tab
    switch(tabName) {
        case 'classes':
            loadClasses();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'wods':
            loadWods();
            break;
    }
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        showToast('Erro na comunicação com o servidor', 'error');
        throw error;
    }
}

// Load Initial Data
async function loadInitialData() {
    try {
        await Promise.all([
            loadUsers(),
            loadWods(),
            loadClasses(),
            loadBookings()
        ]);
    } catch (error) {
        console.error('Failed to load initial data:', error);
    }
}

// Users
async function loadUsers() {
    try {
        users = await apiRequest('/user');
        populateUserSelects();
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

function populateUserSelects() {
    const userSelects = ['bookingUserId', 'bookingUserFilter'];
    
    userSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            // Clear existing options except the first one
            select.innerHTML = select.options[0] ? `<option value="">${select.options[0].text}</option>` : '<option value="">Selecione um usuário</option>';
            
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.firstName} ${user.surname}`;
                select.appendChild(option);
            });
        }
    });
}

// Classes
async function loadClasses() {
    try {
        showLoading('classesContainer');
        classes = await apiRequest('/api/classes');
        renderClasses();
    } catch (error) {
        console.error('Failed to load classes:', error);
        showEmptyState('classesContainer', 'Aulas', 'fas fa-calendar-alt');
    }
}

function renderClasses() {
    const container = document.getElementById('classesContainer');
    
    if (!classes || classes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-alt"></i>
                <h3>Nenhuma aula encontrada</h3>
                <p>Não há aulas disponíveis.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = classes.map(classItem => {
        const isCancelled = classItem.status === 'cancelled';
        return `
            <div class="card">
                <div class="card-header">
                    <b>Aula #${classItem.id}</b> - ${formatDate(classItem.date)} ${classItem.time}
                    ${isCancelled ? ' <span style="color:#dc3545;font-weight:bold;">(Aula cancelada)</span>' : ''}
                </div>
                <div class="card-content">
                    <div class="card-info">
                        <div class="info-item">
                            <span class="info-label">Vagas:</span>
                            <span class="info-value">${classItem.maxspots}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">WOD ID:</span>
                            <span class="info-value">${classItem.wod_id}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="openBookingModalForClass(${classItem.id})" ${isCancelled ? 'disabled' : ''}>
                            Agendar
                        </button>
                        ${isCancelled ? '<div style="color:#dc3545;margin-top:8px;">Aula cancelada</div>' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function createClass(classData) {
    try {
        const newClass = await apiRequest('/api/classes', {
            method: 'POST',
            body: JSON.stringify(classData)
        });
        
        classes.push(newClass);
        renderClasses();
        showToast('Aula criada com sucesso!', 'success');
        closeClassModal();
    } catch (error) {
        console.error('Failed to create class:', error);
    }
}

async function updateClass(id, classData) {
    try {
        await apiRequest(`/api/classes/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(classData)
        });
        
        const index = classes.findIndex(c => c.id === id);
        if (index !== -1) {
            classes[index] = { ...classes[index], ...classData };
        }
        
        renderClasses();
        showToast('Aula atualizada com sucesso!', 'success');
        closeClassModal();
    } catch (error) {
        console.error('Failed to update class:', error);
    }
}

async function deleteClass(id) {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) {
        return;
    }

    try {
        await apiRequest(`/api/classes/${id}`, {
            method: 'DELETE'
        });
        
        classes = classes.filter(c => c.id !== id);
        renderClasses();
        showToast('Aula excluída com sucesso!', 'success');
    } catch (error) {
        console.error('Failed to delete class:', error);
    }
}

function filterClasses() {
    const dateFilter = document.getElementById('classDateFilter').value;
    
    if (!dateFilter) {
        renderClasses();
        return;
    }

    // Usar a nova rota com query parameter
    apiRequest(`/api/classes/by-date?date=${dateFilter}`)
        .then(filteredClasses => {
            const container = document.getElementById('classesContainer');
            
            if (filteredClasses.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>Nenhuma aula encontrada</h3>
                        <p>Não há aulas para a data selecionada.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = filteredClasses.map(classItem => `
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Aula #${classItem.id}</h3>
                        <div class="card-actions">
                            <button class="btn btn-secondary" onclick="editClass(${classItem.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger" onclick="deleteClass(${classItem.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="card-info">
                            <div class="info-item">
                                <span class="info-label">Data:</span>
                                <span class="info-value">${formatDate(classItem.date)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Horário:</span>
                                <span class="info-value">${classItem.time}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Vagas:</span>
                                <span class="info-value">${classItem.maxspots}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">WOD ID:</span>
                                <span class="info-value">${classItem.wod_id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error filtering classes:', error);
            showToast('Erro ao filtrar aulas', 'error');
        });
}

// Função utilitária para verificar perfil
function isAdminOrCoach() {
    return currentUser && (currentUser.profile === 'admin' || currentUser.profile === 'coach');
}

// Filtro e renderização especial para ADMIN/COACH
function filterAndRenderClassesForAdmin(dateFilter) {
    apiRequest(`/api/classes/by-date?date=${dateFilter}`)
        .then(filteredClasses => {
            // Filtrar apenas aulas que ainda não começaram (corrigindo fuso/UTC)
            const now = new Date();
            const upcoming = filteredClasses.filter(classItem => {
                // Garantir formato correto: YYYY-MM-DDTHH:mm:00 (segundos opcionais)
                let dateStr = classItem.date;
                let timeStr = classItem.time;
                if (timeStr.length === 5) timeStr += ':00'; // garantir segundos
                // Montar string local sem UTC
                const classDateTime = new Date(`${dateStr}T${timeStr}`);
                // Se a data for inválida, não exibe
                if (isNaN(classDateTime.getTime())) return false;
                // Considerar tolerância de 1 minuto para evitar problemas de milissegundos
                return classDateTime.getTime() > now.getTime() + 60000;
            });
            renderAdminClassList(upcoming, dateFilter);
        })
        .catch(error => {
            console.error('Error filtering classes:', error);
            showToast('Erro ao filtrar aulas', 'error');
        });
}

// Renderização da lista com seleção múltipla
function renderAdminClassList(classList, dateFilter) {
    const container = document.getElementById('classesContainer');
    if (classList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>Nenhuma aula futura para o dia selecionado.</h3>
            </div>
        `;
        return;
    }
    container.innerHTML = `
        <form id="adminCancelForm">
            <div style="margin-bottom: 16px;">
                <button type="button" class="btn btn-danger" onclick="openAdminCancelModal()">Cancel Selected</button>
            </div>
            ${classList.map(classItem => {
                const isCancelled = classItem.status === 'cancelled';
                return `
                <div class="card">
                    <div class="card-header">
                        <input type="checkbox" class="admin-cancel-checkbox" value="${classItem.id}" ${isCancelled ? 'disabled' : ''} />
                        <span style="margin-left:8px;"><b>Aula #${classItem.id}</b> - ${formatDate(classItem.date)} ${classItem.time}
                        ${isCancelled ? ' <span style=\"color:#dc3545;font-weight:bold;\">(Aula cancelada)</span>' : ''}
                        </span>
                    </div>
                    <div class="card-content">
                        <div class="card-info">
                            <div class="info-item">
                                <span class="info-label">Vagas:</span>
                                <span class="info-value">${classItem.maxspots}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">WOD ID:</span>
                                <span class="info-value">${classItem.wod_id}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }).join('')}
        </form>
        <div id="adminCancelModal" class="modal" style="display:none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Do you really want to cancel the following classes?</h3>
                </div>
                <div class="modal-body" id="adminCancelModalBody"></div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeAdminCancelModal()">No</button>
                    <button class="btn btn-danger" onclick="confirmAdminCancel()">Yes</button>
                </div>
            </div>
        </div>
    `;
}

// Função chamada ao clicar em "Cancel Selected"
window.openAdminCancelModal = function() {
    const checkboxes = document.querySelectorAll('.admin-cancel-checkbox:checked');
    if (checkboxes.length === 0) {
        showToast('Selecione pelo menos uma aula para cancelar.', 'error');
        return;
    }
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    const classList = Array.from(checkboxes).map(cb => {
        const card = cb.closest('.card');
        const header = card.querySelector('.card-header span').textContent;
        return header;
    });
    document.getElementById('adminCancelModalBody').innerHTML = classList.map(txt => `<div>${txt}</div>`).join('');
    document.getElementById('adminCancelModal').style.display = 'block';
}
window.closeAdminCancelModal = function() {
    document.getElementById('adminCancelModal').style.display = 'none';
}
window.confirmAdminCancel = async function() {
    const checkboxes = document.querySelectorAll('.admin-cancel-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    if (selectedIds.length === 0) {
        showToast('Nenhuma aula selecionada.', 'error');
        closeAdminCancelModal();
        return;
    }
    try {
        await Promise.all(selectedIds.map(id => apiRequest(`/api/classes/${id}/cancel`, { method: 'PATCH' })));
        // Atualizar visualmente para status cancelado
        selectedIds.forEach(id => {
            const card = document.querySelector(`.admin-cancel-checkbox[value="${id}"]`).closest('.card');
            if (card) {
                card.querySelector('.admin-cancel-checkbox').disabled = true;
                const span = card.querySelector('.card-header span');
                if (span && !span.innerHTML.includes('Cancelada')) {
                    span.innerHTML += ' <span style="color:#dc3545;font-weight:bold;">(Aula cancelada)</span>';
                }
            }
        });
        showToast('Aulas canceladas com sucesso!', 'success');
        closeAdminCancelModal();
    } catch (error) {
        showToast('Erro ao cancelar aulas.', 'error');
    }
}

// Bookings
async function loadBookings() {
    try {
        showLoading('bookingsContainer');
        bookings = await apiRequest('/api/bookings');
        renderBookings();
    } catch (error) {
        console.error('Failed to load bookings:', error);
        showEmptyState('bookingsContainer', 'Reservas', 'fas fa-calendar-check');
    }
}

function renderBookings() {
    const container = document.getElementById('bookingsContainer');
    
    if (bookings.length === 0) {
        showEmptyState(container, 'Reservas', 'fas fa-calendar-check');
        return;
    }

    container.innerHTML = bookings.map(booking => {
        const user = users.find(u => u.id === booking.user?.id);
        const classItem = classes.find(c => c.id === booking.class?.id);
        const isClassCancelled = classItem && classItem.status === 'cancelled';
        const isBookingCancelled = booking.status === 'cancelled';
        const isUnavailable = isClassCancelled || isBookingCancelled;
        return `
            <div class="card${isUnavailable ? ' cancelled-booking' : ''}">
                <div class="card-header">
                    <h3 class="card-title">Reserva #${booking.id}</h3>
                    <div class="card-actions">
                        <button class="btn btn-danger" onclick="handleCancelBooking(${booking.id})" ${isUnavailable ? 'disabled' : ''}>
                            Cancel Booking
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-info">
                        <div class="info-item">
                            <span class="info-label">Usuário:</span>
                            <span class="info-value">${user ? `${user.firstName} ${user.surname}` : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Aula:</span>
                            <span class="info-value">${classItem ? `Aula #${classItem.id} - ${formatDate(classItem.date)} ${classItem.time}` : 'N/A'}${isClassCancelled ? ' <span style=\"color:#dc3545;font-weight:bold;\">(Aula cancelada)</span>' : ''}${isBookingCancelled ? ' <span style=\"color:#dc3545;font-weight:bold;\">(Reserva cancelada)</span>' : ''}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Data da Reserva:</span>
                            <span class="info-value">${formatDate(booking.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function createBooking(bookingData) {
    try {
        const newBooking = await apiRequest('/api/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
        
        bookings.push(newBooking);
        renderBookings();
        showToast('Reserva criada com sucesso!', 'success');
        closeBookingModal();
    } catch (error) {
        console.error('Failed to create booking:', error);
    }
}

async function deleteBooking(id) {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) {
        return;
    }

    try {
        await apiRequest(`/api/bookings/${id}`, {
            method: 'DELETE'
        });
        
        bookings = bookings.filter(b => b.id !== id);
        renderBookings();
        showToast('Reserva cancelada com sucesso!', 'success');
    } catch (error) {
        console.error('Failed to delete booking:', error);
    }
}

function filterBookings() {
    const userFilter = document.getElementById('bookingUserFilter').value;
    const dateFilter = document.getElementById('bookingDateFilter').value;
    
    let filteredBookings = bookings;

    if (userFilter) {
        filteredBookings = filteredBookings.filter(booking => 
            booking.user?.id === parseInt(userFilter)
        );
    }

    if (dateFilter) {
        filteredBookings = filteredBookings.filter(booking => 
            booking.class?.date === dateFilter
        );
    }

    const container = document.getElementById('bookingsContainer');
    
    if (dateFilter && filteredBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>You have no bookings for the selected date.</h3>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredBookings.map(booking => {
        const user = users.find(u => u.id === booking.user?.id);
        const classItem = classes.find(c => c.id === booking.class?.id);
        
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Reserva #${booking.id}</h3>
                    <div class="card-actions">
                        <button class="btn btn-danger" onclick="handleCancelBooking(${booking.id})">
                            Cancel Booking
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-info">
                        <div class="info-item">
                            <span class="info-label">Usuário:</span>
                            <span class="info-value">${user ? `${user.firstName} ${user.surname}` : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Aula:</span>
                            <span class="info-value">${classItem ? `Aula #${classItem.id} - ${formatDate(classItem.date)} ${classItem.time}` : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Data da Reserva:</span>
                            <span class="info-value">${formatDate(booking.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Função para cancelar reserva com verificação de tempo
async function handleCancelBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    const classItem = classes.find(c => c.id === booking.class?.id);
    if (!classItem) return;

    // Combina data e hora da aula
    const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
    const now = new Date();
    const diffMinutes = (classDateTime - now) / (1000 * 60);

    if (diffMinutes <= 120) {
        showToast('Bookings can only be cancelled at least 2 hours before the scheduled time.', 'error');
        return;
    }

    if (!confirm(`Tem certeza que deseja cancelar esta reserva?`)) {
        return;
    }

    try {
        await apiRequest(`/api/bookings/${id}`, {
            method: 'DELETE'
        });
        bookings = bookings.filter(b => b.id !== id);
        filterBookings();
        showToast(`Booking successfully cancelled for ${formatDate(classItem.date)} at ${classItem.time}.`, 'success');
    } catch (error) {
        console.error('Failed to delete booking:', error);
    }
}

// WODs
async function loadWods() {
    try {
        wods = await apiRequest('/api/wods');
        populateWodSelects();
        renderWods();
    } catch (error) {
        console.error('Failed to load WODs:', error);
    }
}

function populateWodSelects() {
    const wodSelect = document.getElementById('classWodId');
    if (wodSelect) {
        wodSelect.innerHTML = '<option value="">Selecione um WOD</option>';
        
        wods.forEach(wod => {
            const option = document.createElement('option');
            option.value = wod.id;
            option.textContent = `${wod.title} - ${formatDate(wod.date)}`;
            wodSelect.appendChild(option);
        });
    }
}

function renderWods() {
    const container = document.getElementById('wodsContainer');
    
    if (wods.length === 0) {
        showEmptyState(container, 'WODs', 'fas fa-dumbbell');
        return;
    }

    container.innerHTML = wods.map(wod => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${wod.title}</h3>
                <div class="card-actions">
                    <button class="btn btn-secondary" onclick="editWod(${wod.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteWod(${wod.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="card-info">
                    <div class="info-item">
                        <span class="info-label">Data:</span>
                        <span class="info-value">${formatDate(wod.date)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Descrição:</span>
                        <span class="info-value">${wod.description}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function openClassModal(classId = null) {
    const modal = document.getElementById('classModal');
    const title = document.getElementById('classModalTitle');
    const form = document.getElementById('classForm');
    
    if (classId) {
        const classItem = classes.find(c => c.id === classId);
        if (classItem) {
            title.textContent = 'Editar Aula';
            document.getElementById('classDate').value = classItem.date;
            document.getElementById('classTime').value = classItem.time;
            document.getElementById('classMaxSpots').value = classItem.maxspots;
            document.getElementById('classWodId').value = classItem.wod_id;
            
            form.onsubmit = (e) => {
                e.preventDefault();
                updateClass(classId, {
                    date: document.getElementById('classDate').value,
                    time: document.getElementById('classTime').value,
                    maxspots: parseInt(document.getElementById('classMaxSpots').value),
                    wod_id: parseInt(document.getElementById('classWodId').value)
                });
            };
        }
    } else {
        title.textContent = 'Nova Aula';
        form.reset();
        
        form.onsubmit = (e) => {
            e.preventDefault();
            createClass({
                date: document.getElementById('classDate').value,
                time: document.getElementById('classTime').value,
                maxspots: parseInt(document.getElementById('classMaxSpots').value),
                wod_id: parseInt(document.getElementById('classWodId').value)
            });
        };
    }
    
    modal.style.display = 'block';
}

function closeClassModal() {
    document.getElementById('classModal').style.display = 'none';
}

function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    const form = document.getElementById('bookingForm');
    
    form.reset();
    
    form.onsubmit = (e) => {
        e.preventDefault();
        createBooking({
            userId: parseInt(document.getElementById('bookingUserId').value),
            classId: parseInt(document.getElementById('bookingClassId').value)
        });
    };
    
    // Populate class select
    const classSelect = document.getElementById('bookingClassId');
    classSelect.innerHTML = '<option value="">Selecione uma aula</option>';
    
    classes.forEach(classItem => {
        const option = document.createElement('option');
        option.value = classItem.id;
        option.textContent = `Aula #${classItem.id} - ${formatDate(classItem.date)} ${classItem.time}`;
        classSelect.appendChild(option);
    });
    
    modal.style.display = 'block';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function openWodModal(wodId = null) {
    const modal = document.getElementById('wodModal');
    const title = document.getElementById('wodModalTitle');
    const form = document.getElementById('wodForm');
    
    if (wodId) {
        const wod = wods.find(w => w.id === wodId);
        if (wod) {
            title.textContent = 'Editar WOD';
            document.getElementById('wodTitle').value = wod.title;
            document.getElementById('wodDescription').value = wod.description;
            document.getElementById('wodDate').value = wod.date;
            
            form.onsubmit = (e) => {
                e.preventDefault();
                updateWod(wodId, {
                    title: document.getElementById('wodTitle').value,
                    description: document.getElementById('wodDescription').value,
                    date: document.getElementById('wodDate').value
                });
            };
        }
    } else {
        title.textContent = 'Novo WOD';
        form.reset();
        
        form.onsubmit = (e) => {
            e.preventDefault();
            createWod({
                title: document.getElementById('wodTitle').value,
                description: document.getElementById('wodDescription').value,
                date: document.getElementById('wodDate').value
            });
        };
    }
    
    modal.style.display = 'block';
}

function closeWodModal() {
    document.getElementById('wodModal').style.display = 'none';
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div class="loading">Carregando...</div>';
}

function showEmptyState(container, title, icon) {
    container.innerHTML = `
        <div class="empty-state">
            <i class="${icon}"></i>
            <h3>Nenhum ${title.toLowerCase()} encontrado</h3>
            <p>Clique no botão "Novo" para adicionar um ${title.toLowerCase()}.</p>
        </div>
    `;
}

// Event Listeners
function setupEventListeners() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };

    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Global functions for onclick handlers
window.openClassModal = openClassModal;
window.closeClassModal = closeClassModal;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.openWodModal = openWodModal;
window.closeWodModal = closeWodModal;
window.filterClasses = filterClasses;
window.filterBookings = filterBookings;
window.deleteClass = deleteClass;
window.deleteBooking = deleteBooking;
window.editClass = (id) => openClassModal(id);
window.editWod = (id) => openWodModal(id); 
window.handleCancelBooking = handleCancelBooking; 

// --- ADMIN/COACH: Cancelamento em lote na aba de reservas ---
function renderAdminBookClassesForDate(dateFilter) {
    apiRequest(`/api/classes/by-date?date=${dateFilter}`)
        .then(classesOfDay => {
            const container = document.getElementById('bookingsContainer');
            if (!classesOfDay || classesOfDay.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calendar-times"></i>
                        <h3>Nenhuma aula encontrada para a data selecionada.</h3>
                    </div>
                `;
                return;
            }
            const now = new Date();
            container.innerHTML = `
                <form id="adminBookCancelForm">
                    <div style="margin-bottom: 16px;">
                        <button type="button" class="btn btn-danger" onclick="openAdminBookCancelModal()">Cancel Selected</button>
                    </div>
                    ${classesOfDay.map(classItem => {
                        let dateStr = classItem.date;
                        let timeStr = classItem.time;
                        if (timeStr.length === 5) timeStr += ':00';
                        const classDateTime = new Date(`${dateStr}T${timeStr}`);
                        const diffMinutes = (classDateTime - now) / (1000 * 60);
                        const canCancel = diffMinutes > 120;
                        const isPast = classDateTime < now;
                        const isCancelled = classItem.status === 'cancelled';
                        return `
                        <div class="card${isCancelled ? ' cancelled-booking' : ''}">
                            <div class="card-header">
                                <input type="checkbox" class="admin-book-cancel-checkbox" value="${classItem.id}" ${(!canCancel || isPast || isCancelled) ? 'disabled' : ''} />
                                <span style="margin-left:8px;"><b>Aula #${classItem.id}</b> - ${formatDate(classItem.date)} ${classItem.time}
                                ${isPast ? ' <span style=\"color:#dc3545;font-weight:bold;\">(Passada)</span>' : ''}
                                ${!isPast && !canCancel ? ' <span style=\"color:#dc3545;font-weight:bold;\">(Menos de 2h)</span>' : ''}
                                ${isCancelled ? ' <span style=\"color:#dc3545;font-weight:bold;\">(Cancelada)</span>' : ''}
                                </span>
                            </div>
                            <div class="card-content">
                                <div class="card-info">
                                    <div class="info-item">
                                        <span class="info-label">Vagas:</span>
                                        <span class="info-value">${classItem.maxspots}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">WOD ID:</span>
                                        <span class="info-value">${classItem.wod_id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </form>
                <div id="adminBookCancelModal" class="modal" style="display:none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Do you really want to cancel the following classes?</h3>
                        </div>
                        <div class="modal-body" id="adminBookCancelModalBody"></div>
                        <div class="form-actions">
                            <button class="btn btn-secondary" onclick="closeAdminBookCancelModal()">No</button>
                            <button class="btn btn-danger" onclick="confirmAdminBookCancel()">Yes</button>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            showToast('Erro ao buscar aulas do dia.', 'error');
        });
}

window.openAdminBookCancelModal = function() {
    const checkboxes = document.querySelectorAll('.admin-book-cancel-checkbox:checked');
    if (checkboxes.length === 0) {
        showToast('Selecione pelo menos uma aula para cancelar.', 'error');
        return;
    }
    const classList = Array.from(checkboxes).map(cb => {
        const card = cb.closest('.card');
        const header = card.querySelector('.card-header span').textContent;
        return header;
    });
    document.getElementById('adminBookCancelModalBody').innerHTML = classList.map(txt => `<div>${txt}</div>`).join('');
    document.getElementById('adminBookCancelModal').style.display = 'block';
}
window.closeAdminBookCancelModal = function() {
    document.getElementById('adminBookCancelModal').style.display = 'none';
}
window.confirmAdminBookCancel = async function() {
    const checkboxes = document.querySelectorAll('.admin-book-cancel-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    if (selectedIds.length === 0) {
        showToast('Nenhuma aula selecionada.', 'error');
        closeAdminBookCancelModal();
        return;
    }
    try {
        await Promise.all(selectedIds.map(id => apiRequest(`/api/classes/${id}`, { method: 'DELETE' })));
        // Atualizar visualmente para status cancelado
        selectedIds.forEach(id => {
            const card = document.querySelector(`.admin-book-cancel-checkbox[value="${id}"]`).closest('.card');
            if (card) {
                card.classList.add('cancelled-booking');
                card.querySelector('.admin-book-cancel-checkbox').disabled = true;
                const span = card.querySelector('.card-header span');
                if (span && !span.innerHTML.includes('Cancelada')) {
                    span.innerHTML += ' <span style="color:#dc3545;font-weight:bold;">(Cancelada)</span>';
                }
            }
        });
        showToast('Aulas canceladas com sucesso!', 'success');
        closeAdminBookCancelModal();
    } catch (error) {
        showToast('Erro ao cancelar aulas.', 'error');
    }
}

// Modificar filterBookings para ADMIN/COACH
const originalFilterBookings = filterBookings;
window.filterBookings = function() {
    const dateFilter = document.getElementById('bookingDateFilter').value;
    if (isAdminOrCoach() && dateFilter) {
        renderAdminBookClassesForDate(dateFilter);
    } else {
        originalFilterBookings();
    }
} 

// Substituir a função fetchFrequency para garantir que a mensagem de total de presenças só aparece abaixo dos cards
async function fetchFrequency() {
    const userId = document.getElementById('frequencyUserFilter').value;
    const start = document.getElementById('frequencyStartDate').value;
    const end = document.getElementById('frequencyEndDate').value;
    const container = document.getElementById('frequencyContainer');

    if (!userId || !start || !end) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-user-clock"></i><h3>Preencha todos os campos para buscar frequência.</h3></div>';
        return;

    }

    try {
        container.innerHTML = '<div class="loading">Buscando frequência...</div>';
        const freq = await apiRequest(`/api/bookings/frequency?userId=${userId}&start=${start}&end=${end}`);
        if (!freq || freq.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-user-clock"></i><h3>Nenhuma presença encontrada no período.</h3></div>';
            return;
        }
        let html = freq.map(b => {
            return `<div class="card">
                <div class="card-header">
                    <b>Reserva #${b.id}</b> - ${b.class?.date || ''} ${b.class?.time || ''}
                </div>
                <div class="card-content">
                    <div class="card-info">
                        <div class="info-item"><span class="info-label">Aula:</span> <span class="info-value">${b.class ? `Aula #${b.class.id}` : 'N/A'}</span></div>
                        <div class="info-item"><span class="info-label">Data:</span> <span class="info-value">${b.class?.date || ''}</span></div>
                        <div class="info-item"><span class="info-label">Horário:</span> <span class="info-value">${b.class?.time || ''}</span></div>
                    </div>
                </div>
            </div>`;
        }).join('');
        // Exibir total apenas abaixo dos cards
        html += `<div class='summary' style='margin-top:16px;'><b>Total de presenças: ${freq.length}</b></div>`;
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-user-clock"></i><h3>Erro ao buscar frequência.</h3></div>';
    }
} } 
