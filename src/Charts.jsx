import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement } from "chart.js";

ChartJS.register(ArcElement);

const Charts = ({ notes, navigateToApp}) => {
    const countNotesByBucket = (bucketName) => {
        return notes.filter((note) => note.bucket === bucketName).length;
    };

    const labels = ['Not started', 'In progress', 'Late', 'Completed'];
    const data = labels.map((label) => countNotesByBucket(label));

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(255, 150, 80)',
                ],
                hoverOffset: 0, // Wyłącz funkcję powiększania po najechaniu
            },
        ],
    };

    const [hoveredLabel, setHoveredLabel] = useState(null);
    const [hoveredLabelCount, setHoveredLabelCount] = useState(0);

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
            },
        },
        onHover: (event, elements) => {
            if (elements.length > 0) {
                const hoveredBucketIndex = elements[0].index;
                const hoveredBucketName = labels[hoveredBucketIndex];
                setHoveredLabel(hoveredBucketName);
                setHoveredLabelCount(data[hoveredBucketIndex]);
            } else {
                setHoveredLabel(null);
                setHoveredLabelCount(0);
            }
        },
    };

    const chartStyle = {
        width: '200px',
        height: '200px',
    };

    const navigateBackToApp = () => {
        navigateToApp();
    };

    return (
        <div className="chart-container" style={chartStyle}>
            <button onClick={navigateBackToApp}>Powrót do App</button>
            <Doughnut data={chartData} options={chartOptions} />
            {hoveredLabel && <div>Hovered Label: {hoveredLabel} ({hoveredLabelCount})</div>}
        </div>
    );
};

export default Charts;
