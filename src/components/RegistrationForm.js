import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../pages/LoginPage.css';

const RegistrationForm = () => {
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        address: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [localErrors, setLocalErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateFrontend = () => {
        const newErrors = {};

        if (formData.firstName.length < 4 || !/^[a-zA-Z]+$/.test(formData.firstName)) {
            newErrors.firstName = 'First name must be at least 4 characters and contain only alphabets.';
        }
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address (e.g., name@domain.com).';
        }
        if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number must contain exactly 10 digits.';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name cannot be empty.';
        }
        if (!formData.address.trim()) {
            newErrors.address = 'Address cannot be empty.';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLocalErrors({});

        const frontendErrors = validateFrontend();
        if (Object.keys(frontendErrors).length > 0) {
            setLocalErrors(frontendErrors);
            alert('Please correct the highlighted errors before submitting.');
            return;
        }

        try {
            await register(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName,
                formData.mobile,
                formData.address
            );
            setMessage('Registration successful! Please sign in.');
            setFormData({
                firstName: '', lastName: '', email: '',
                mobile: '', address: '', password: ''
            });
        } catch (error) {
            let errorMessage = 'Registration failed.';
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'Email already in use. Please sign in or use another email.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password too weak (min 6 characters).';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email format.';
                        break;
                    default:
                        errorMessage = `Registration error: ${error.message}`;
                }
            }
            setMessage(errorMessage);
            alert(errorMessage);
            console.error("Firebase Registration error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {message && <p style={{ color: message.includes('successful') ? 'green' : 'red', marginBottom: '1rem' }}>{message}</p>}
            
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            {localErrors.firstName && <p className="error-message">{localErrors.firstName}</p>}

            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            {localErrors.lastName && <p className="error-message">{localErrors.lastName}</p>}

            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            {localErrors.email && <p className="error-message">{localErrors.email}</p>}

            <input type="tel" name="mobile" placeholder="Mobile Number (10 digits)" value={formData.mobile} onChange={handleChange} required />
            {localErrors.mobile && <p className="error-message">{localErrors.mobile}</p>}

            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            {localErrors.address && <p className="error-message">{localErrors.address}</p>}

            <input type="password" name="password" placeholder="Password (min. 6 characters)" value={formData.password} onChange={handleChange} required />
            {localErrors.password && <p className="error-message">{localErrors.password}</p>}
            
            <button type="submit">Create Account</button>
        </form>
    );
};

export default RegistrationForm;