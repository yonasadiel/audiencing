import axios from 'axios';

export type StateType = 'empty' | 'short' | 'radio';
export type State = {
    code: string
    mainText: string
    type: StateType
    options: string[]
}

type SessionData = {
    meta: {
        title: string
        stateCode: string
    }
    state: State
}

type SubmitResponse = {
    success: boolean
}

const axiosPostConfig = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }};

const API_URL :string = 'https://script.google.com/macros/s/AKfycbyH-raUrK-vGisL0FJqpDXWgh0zyzyvb4zInjJLR634TUnISgDpEwmElkWJSEkqDf5S/exec';

export const getSession = (sessionName: string) => {
    const url = `${API_URL}?action=getSession&session=${sessionName}`;
    return axios.get(url).then((res) => {
        return res.data as SessionData | null;
    });
}

export const submitAnswer = (sessionName: string, token: string, stateCode: string, answer: string) => {
    const params = new URLSearchParams({
        action: 'submitAnswer',
        session: sessionName,
        token: token,
        stateCode: stateCode,
        answer: answer,
    });
    return axios.post(API_URL, params, axiosPostConfig).then((res) => res.data as SubmitResponse);
}

export const register = (sessionName: string, token: string, id: string) => {
    const params = new URLSearchParams({
        action: 'register',
        session: sessionName,
        token: token,
        id: id,
    });
    return axios.post(API_URL, params, axiosPostConfig).then((res) => res.data as SubmitResponse);
}
