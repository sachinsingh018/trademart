// Advanced email validation with email-validator library
import validator from 'email-validator';

export interface EmailValidationResult {
    isValid: boolean;
    isDisposable: boolean;
    isJunk: boolean;
    message: string;
}

export interface PhoneValidationResult {
    isValid: boolean;
    countryCode: string;
    formattedNumber: string;
    message: string;
}

// Common disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc',
    'yopmail.com', 'sharklasers.com', 'grr.la', 'guerrillamailblock.com',
    'pokemail.net', 'spam4.me', 'bccto.me', 'chacuo.net', 'dispostable.com',
    'fakeinbox.com', 'mailnesia.com', 'mailnull.com', 'meltmail.com',
    'spamgourmet.com', 'spamhole.com', 'spam.la', 'spambox.us',
    'spamcannon.net', 'spamcon.org', 'spamcorptastic.com', 'spamcowboy.com',
    'spamdecoy.net', 'spamex.com', 'spamfighter.com', 'spamfree.eu',
    'spamfree24.com', 'spamfree24.de', 'spamfree24.eu', 'spamgoes.com',
    'spamgourmet.com', 'spamherelots.com', 'spamhereplease.com', 'spamhole.com',
    'spamify.com', 'spaminator.de', 'spamkill.info', 'spaml.com',
    'spaml.de', 'spammotel.com', 'spamobox.com', 'spamoff.de',
    'spamslicer.com', 'spamspot.com', 'spamthis.co.uk', 'spamthisplease.com',
    'spamtrail.com', 'spamtroll.net', 'spamwc.de', 'spamwc.fr',
    'spamwc.pt', 'spamwc.ru', 'spamwc.us', 'spamwc.za', 'spamwc.com',
    'spamwc.net', 'spamwc.org', 'spamwc.info', 'spamwc.biz',
    'spamwc.co.uk', 'spamwc.co.za', 'spamwc.co.jp', 'spamwc.co.kr',
    'spamwc.co.in', 'spamwc.co.id', 'spamwc.co.th', 'spamwc.co.my',
    'spamwc.co.sg', 'spamwc.co.hk', 'spamwc.co.tw', 'spamwc.co.il',
    'spamwc.co.ae', 'spamwc.co.sa', 'spamwc.co.eg', 'spamwc.co.ma',
    'spamwc.co.ng', 'spamwc.co.ke', 'spamwc.co.za', 'spamwc.co.zw',
    'spamwc.co.bw', 'spamwc.co.na', 'spamwc.co.sz', 'spamwc.co.ls',
    'spamwc.co.mg', 'spamwc.co.mu', 'spamwc.co.sc', 'spamwc.co.km',
    'spamwc.co.dj', 'spamwc.co.so', 'spamwc.co.et', 'spamwc.co.er',
    'spamwc.co.sd', 'spamwc.co.ss', 'spamwc.co.td', 'spamwc.co.cf',
    'spamwc.co.cm', 'spamwc.co.cg', 'spamwc.co.cd', 'spamwc.co.ao',
    'spamwc.co.zm', 'spamwc.co.mw', 'spamwc.co.mz', 'spamwc.co.mg',
    'spamwc.co.mu', 'spamwc.co.sc', 'spamwc.co.km', 'spamwc.co.dj',
    'spamwc.co.so', 'spamwc.co.et', 'spamwc.co.er', 'spamwc.co.sd',
    'spamwc.co.ss', 'spamwc.co.td', 'spamwc.co.cf', 'spamwc.co.cm',
    'spamwc.co.cg', 'spamwc.co.cd', 'spamwc.co.ao', 'spamwc.co.zm',
    'spamwc.co.mw', 'spamwc.co.mz', 'spamwc.co.mg', 'spamwc.co.mu',
    'spamwc.co.sc', 'spamwc.co.km', 'spamwc.co.dj', 'spamwc.co.so',
    'spamwc.co.et', 'spamwc.co.er', 'spamwc.co.sd', 'spamwc.co.ss',
    'spamwc.co.td', 'spamwc.co.cf', 'spamwc.co.cm', 'spamwc.co.cg',
    'spamwc.co.cd', 'spamwc.co.ao', 'spamwc.co.zm', 'spamwc.co.mw',
    'spamwc.co.mz', 'spamwc.co.mg', 'spamwc.co.mu', 'spamwc.co.sc',
    'spamwc.co.km', 'spamwc.co.dj', 'spamwc.co.so', 'spamwc.co.et',
    'spamwc.co.er', 'spamwc.co.sd', 'spamwc.co.ss', 'spamwc.co.td',
    'spamwc.co.cf', 'spamwc.co.cm', 'spamwc.co.cg', 'spamwc.co.cd',
    'spamwc.co.ao', 'spamwc.co.zm', 'spamwc.co.mw', 'spamwc.co.mz'
];

// Additional validation patterns for suspicious emails
const SUSPICIOUS_PATTERNS = [
    /^\d+/, // Starts with numbers
    /[^a-zA-Z0-9@._-]/, // Contains special chars
];

export function validateEmail(email: string): EmailValidationResult {
    // Basic validation
    if (!email || email.trim() === '') {
        return {
            isValid: false,
            isDisposable: false,
            isJunk: false,
            message: 'Email address is required'
        };
    }

    // Use email-validator for proper email format validation
    if (!validator.validate(email)) {
        return {
            isValid: false,
            isDisposable: false,
            isJunk: true,
            message: 'Please enter a valid email address'
        };
    }

    // Check for disposable email domains
    const domain = email.split('@')[1]?.toLowerCase();
    const isDisposable = DISPOSABLE_EMAIL_DOMAINS.includes(domain || '');

    // Check for suspicious patterns
    const isJunk = isDisposable ||
        email.includes('+') || // Plus addressing often used for spam
        SUSPICIOUS_PATTERNS.some(pattern => pattern.test(email)) ||
        email.length > 50; // Unusually long emails

    if (isDisposable) {
        return {
            isValid: false,
            isDisposable: true,
            isJunk: true,
            message: 'Disposable email addresses are not allowed. Please use a permanent email.'
        };
    }

    if (isJunk) {
        return {
            isValid: false,
            isDisposable: false,
            isJunk: true,
            message: 'This email address appears to be invalid or suspicious. Please use a legitimate email.'
        };
    }

    return {
        isValid: true,
        isDisposable: false,
        isJunk: false,
        message: 'Email address is valid'
    };
}

export function validatePhoneNumber(phoneNumber: string): PhoneValidationResult {
    if (!phoneNumber || phoneNumber.trim() === '') {
        return {
            isValid: false,
            countryCode: '',
            formattedNumber: '',
            message: 'Phone number is required'
        };
    }

    // Remove all non-digit characters except + at the beginning
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // Check if it starts with + (international format)
    if (!cleaned.startsWith('+')) {
        return {
            isValid: false,
            countryCode: '',
            formattedNumber: '',
            message: 'Please enter phone number with country code (e.g., +1234567890)'
        };
    }

    // Check length (should be between 8-15 digits after country code)
    const digitsOnly = cleaned.substring(1); // Remove the +
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return {
            isValid: false,
            countryCode: '',
            formattedNumber: '',
            message: 'Phone number should be 7-15 digits long'
        };
    }

    // Extract country code (first 1-3 digits)
    let countryCode = '';
    if (digitsOnly.length >= 7) {
        // Common country codes
        if (digitsOnly.startsWith('1')) {
            countryCode = 'US/CA';
        } else if (digitsOnly.startsWith('44')) {
            countryCode = 'UK';
        } else if (digitsOnly.startsWith('91')) {
            countryCode = 'IN';
        } else if (digitsOnly.startsWith('86')) {
            countryCode = 'CN';
        } else if (digitsOnly.startsWith('81')) {
            countryCode = 'JP';
        } else if (digitsOnly.startsWith('49')) {
            countryCode = 'DE';
        } else if (digitsOnly.startsWith('33')) {
            countryCode = 'FR';
        } else if (digitsOnly.startsWith('39')) {
            countryCode = 'IT';
        } else if (digitsOnly.startsWith('34')) {
            countryCode = 'ES';
        } else if (digitsOnly.startsWith('61')) {
            countryCode = 'AU';
        } else {
            countryCode = 'Unknown';
        }
    }

    return {
        isValid: true,
        countryCode: countryCode,
        formattedNumber: phoneNumber,
        message: 'Phone number is valid'
    };
}
