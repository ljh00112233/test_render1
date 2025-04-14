import React from 'react';
import { useEnv } from './envContext';

const dustInfo = () => {
    const { air } = useEnv();
    if(!air) return null;
    return (
        <div>
            <h3>오늘의 미세먼지 정보</h3>
            <p>📅 측정 시간: {air.dataTime}</p>
            <p>🌫️ 미세먼지(PM10): {air.pm10.value}㎍/㎥ ({air.pm10.grade})</p>
            <p>🌁 초미세먼지(PM2.5): {air.pm25.value}㎍/㎥ ({air.pm25.grade})</p>
        </div>
    );
};

export default dustInfo;