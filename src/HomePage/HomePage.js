import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js';
import * as d3 from 'd3';



function createD3Donut(container, budgetData) {
    if (!container) return;

    d3.select(container).selectAll('*').remove();

    const data = budgetData.map(d => ({
        label: d.title,
        value: d.budget,
    }));

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3
        .scaleOrdinal()
        .domain(data.map(d => d.label))
        .range([
            '#98abc5',
            '#8a89a6',
            '#7b6888',
            '#6b486b',
            '#a05d56',
            '#d0743c',
            '#ff8c00',
        ]);

    const svg = d3
        .select(container)
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3
        .pie()
        .sort(null)
        .value(d => d.value);

    const arc = d3
        .arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    const arcs = svg
        .selectAll('path.slice')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('class', 'slice')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label));

    const labelArc = d3
        .arc()
        .outerRadius(radius * .94)
        .innerRadius(radius * .94);

    svg
        .selectAll('text')
        .data(pie(data))
        .enter()
        .append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '10px')
        .text(d => d.data.label);
}






function HomePage() {


    const chartRef = useRef(null);
    const d3ContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:3001/budget')
            .then((res) => {
                const budgetData = res.data.myBudget;

                const dataSource = {
                    datasets: [
                        {
                            data: budgetData.map((item) => item.budget),
                            backgroundColor: [
                                '#ffcd56',
                                '#ff6384',
                                '#36a2eb',
                                '#fd6b19',
                                '#4bc0c0',
                                '#9966ff',
                                '#ff9f40'
                            ]
                        }
                    ],
                    labels: budgetData.map((item) => item.title)
                };

                //Chart.js Pie
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                const ctx = chartRef.current.getContext('2d');
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'pie',
                    data: dataSource
                });

                //D3 Donut
                createD3Donut(d3ContainerRef.current, budgetData);
            })
            .catch((err) => {
                console.error('Error fetching budget data:', err);
            });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    




    return (
         <main className="center" id="main">

        <section className="page-area" aria-label="Budget features">

            <article>
                <h2>Stay on track</h2>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h2>Alerts</h2>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h2>Results</h2>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h2>Free</h2>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </article>
    
            <article>
                <h2>Stay on track</h2>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h2>Alerts</h2>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h2>Results</h2>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h2>Chart</h2>

                <figure>
                    <canvas id="myChart" width="400" height="400" role="img" aria-label="Pie chart showing how your budget is distributed across categories." ref={chartRef}></canvas>

                    <figcaption>Visual breakdown of your personal budget by category.</figcaption>
                </figure>
            </article>

             <article className="donut-article">
                
                <h2>D3 Donut Chart</h2>
                
                <figure>
                    <div id="d3-donut" role="img" aria-label="Donut chart showing your budget distribution by category" ref={d3ContainerRef}></div>
                    <figcaption>D3.js donut chart of your personal budget.</figcaption>
                </figure>
            </article>


            </section>

        </main>
    );
}

export default HomePage;