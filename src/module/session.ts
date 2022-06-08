const AUDIENCING_META = 'meta';
const EXPIRY = 24 * 60 * 60 * 1000; // meta should be expired after 24h

export type Meta = {
    sessionName: string;
    sessionToken: string;
    registeredName: string | null;
    startDate: number;
    answeredCodes: string[];
} 

export const getStoredMeta = (): Meta | null => {
    const rawMeta = localStorage.getItem(AUDIENCING_META);
    if (rawMeta === null) {
        return null;
    }
    const meta: Meta = JSON.parse(rawMeta);
    if (meta.startDate + EXPIRY < new Date().getTime()) {
        clearMeta();
        return null;
    }
    return meta;
}

export const startSession = (sessionName: string): Meta => {
    const meta: Meta = {
        sessionName: sessionName,
        sessionToken: Math.random().toString(16).substr(2),
        registeredName: null,
        startDate: new Date().getTime(),
        answeredCodes: [],
    };
    localStorage.setItem(AUDIENCING_META, JSON.stringify(meta));
    return meta;
}

export const registerName = (name: string): Meta | null => {
    const meta = getStoredMeta();
    if (!meta) return null;
    const newMeta: Meta = { ...meta, registeredName: name };
    localStorage.setItem(AUDIENCING_META, JSON.stringify(newMeta));
    return newMeta;
}

export const answer = (code: string): Meta | null => {
    const meta = getStoredMeta();
    if (!meta) return null;
    const newMeta: Meta = { ...meta, answeredCodes: [...meta.answeredCodes, code] };
    localStorage.setItem(AUDIENCING_META, JSON.stringify(newMeta));
    return newMeta;
}

export const clearMeta = () => {
    localStorage.removeItem(AUDIENCING_META);
}
