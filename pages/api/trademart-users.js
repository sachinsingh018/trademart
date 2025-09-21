const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Database connection configuration
const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_Maus8bK6kdvD@ep-cold-forest-a4yns4nq-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: {
        rejectUnauthorized: false
    }
});

// Helper function to generate random password
function generateTempPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            status: 'error',
            error: 'Method not allowed. Only POST requests are accepted.'
        });
    }

    let client;

    try {
        // Validate request body
        const { name, email, phone, role = 'buyer' } = req.body;

        // Check required fields
        if (!email) {
            return res.status(400).json({
                status: 'error',
                error: 'Email is required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                error: 'Invalid email format'
            });
        }

        // Get database connection
        client = await pool.connect();

        // Check if user already exists
        const existingUserQuery = 'SELECT id FROM trademart.users WHERE email = $1';
        const existingUserResult = await client.query(existingUserQuery, [email]);

        let userId;
        let tempPassword;

        if (existingUserResult.rows.length > 0) {
            // User exists - update the user
            userId = existingUserResult.rows[0].id;

            const updateQuery = `
        UPDATE trademart.users 
        SET name = COALESCE($1, name), 
            phone = COALESCE($2, phone), 
            role = COALESCE($3, role)
        WHERE id = $4
        RETURNING id
      `;

            await client.query(updateQuery, [name, phone, role, userId]);

            // Generate new temp password for existing user
            tempPassword = generateTempPassword();
            const hashedPassword = await bcrypt.hash(tempPassword, 12);

            const updatePasswordQuery = `
        UPDATE trademart.users 
        SET password_hash = $1
        WHERE id = $2
      `;

            await client.query(updatePasswordQuery, [hashedPassword, userId]);

        } else {
            // User doesn't exist - create new user
            userId = uuidv4();
            tempPassword = generateTempPassword();
            const hashedPassword = await bcrypt.hash(tempPassword, 12);

            const insertQuery = `
        INSERT INTO trademart.users (id, name, email, phone, password_hash, role, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING id
      `;

            await client.query(insertQuery, [userId, name, email, phone, hashedPassword, role]);
        }

        // Return success response
        return res.status(200).json({
            status: 'ok',
            id: userId,
            temp_password: tempPassword
        });

    } catch (error) {
        console.error('Database error:', error);

        // Handle specific database errors
        if (error.code === '23505') { // Unique constraint violation
            return res.status(500).json({
                status: 'error',
                error: 'Email already exists'
            });
        }

        if (error.code === '23502') { // Not null constraint violation
            return res.status(500).json({
                status: 'error',
                error: 'Required field is missing'
            });
        }

        // Generic error response
        return res.status(500).json({
            status: 'error',
            error: 'Internal server error'
        });

    } finally {
        // Always release the client back to the pool
        if (client) {
            client.release();
        }
    }
}
