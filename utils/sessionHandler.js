const { proto } = require('@whiskeysockets/baileys');
const { Curve, signedKeyPair } = require('@whiskeysockets/baileys/lib/Utils/crypto');
const { constants } = require('buffer');
const { randomBytes } = require('crypto');

class SessionHandler {
    constructor() {
        this.sessions = new Map();
        this.retryCount = new Map();
        this.maxRetries = 3;
    }

    async handleSession(jid, socket) {
        try {
            if (!this.sessions.has(jid)) {
                const { identityKey, signedPreKey } = await this.generateKeys();
                this.sessions.set(jid, {
                    identityKey,
                    signedPreKey,
                    registrationId: this.generateRegistrationId(),
                    lastRefresh: Date.now()
                });
            }

            return this.sessions.get(jid);
        } catch (error) {
            console.error('Session handling error:', error);
            throw error;
        }
    }

    async refreshSession(jid) {
        try {
            const session = await this.handleSession(jid);
            if (Date.now() - session.lastRefresh > 86400000) { // 24 hours
                const { identityKey, signedPreKey } = await this.generateKeys();
                session.identityKey = identityKey;
                session.signedPreKey = signedPreKey;
                session.lastRefresh = Date.now();
            }
            return session;
        } catch (error) {
            console.error('Session refresh error:', error);
            throw error;
        }
    }

    async generateKeys() {
        const identityKey = Curve.generateKeyPair();
        const signedPreKey = signedKeyPair(identityKey.private);

        return {
            identityKey,
            signedPreKey
        };
    }

    generateRegistrationId() {
        return randomBytes(4).readUInt16BE(0) & 0x3fff;
    }

    async handleDecryptionError(jid, error) {
        const retryCount = this.retryCount.get(jid) || 0;
        
        if (error.message.includes('Bad MAC') || error.message.includes('MessageCounterError')) {
            if (retryCount < this.maxRetries) {
                this.retryCount.set(jid, retryCount + 1);
                await this.clearSession(jid);
                return await this.refreshSession(jid);
            } else {
                this.retryCount.delete(jid);
                throw new Error('Max decryption retries reached - Session keys may be corrupted');
            }
        } else {
            throw error; // Propagate other types of errors
        }
    }

    clearSession(jid) {
        this.sessions.delete(jid);
        this.retryCount.delete(jid);
    }
}

module.exports = new SessionHandler();