# Failure Analysis Dashboard

A modern, Apple-inspired dashboard for analyzing equipment failures, identifying gaps, predicting future failures, and assessing risks.

## Features

- **Failure Trends**: Visualize failure data over time, identify patterns, and get AI-generated insights.
- **Gap Analysis**: Analyze performance, reliability, and skill gaps with interactive charts.
- **Predictive Analysis**: AI-powered predictions to anticipate failures before they occur.
- **Risk Assessment**: Comprehensive analysis of potential failure risks with an interactive risk matrix.
- **AI Analysis**: OpenAI-powered analysis of chart data for deeper insights and recommendations.

## Technology Stack

- **React.js**: Frontend library for building the user interface
- **Chart.js & react-chartjs-2**: For data visualization
- **Tailwind CSS**: For styling with Apple-inspired design
- **Framer Motion**: For smooth animations and transitions
- **React Router**: For navigation between different pages
- **Lucide React**: For beautiful icons
- **Papa Parse**: For CSV file parsing
- **OpenAI API**: For AI-powered analysis and insights

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key (for AI Analysis features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/failure-analysis-dashboard.git
cd failure-analysis-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Replace `your_openai_api_key_here` with your actual OpenAI API key

```bash
cp .env.example .env
# Then edit .env with your API key
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Upload Data**: Use the file upload component to upload your CSV data files.
2. **Navigate**: Use the sidebar to navigate between different analysis pages.
3. **Interact**: Interact with charts, risk matrix, and other components to gain insights.
4. **Get AI Insights**: Click the "AI Analysis" button on any chart to get OpenAI-powered insights based on your data.

## AI Analysis Feature

The dashboard includes an AI Analysis feature powered by OpenAI's GPT models. This feature provides:

- Detailed analysis of chart data
- Identification of patterns and anomalies
- Actionable recommendations based on the data
- Potential root causes for observed patterns

To use this feature:
1. Ensure your OpenAI API key is set in the `.env` file
2. Click the "AI Analysis" button on any chart
3. Wait for the AI to generate insights (typically takes 2-5 seconds)
4. Review the analysis in the modal that appears

## Dark Mode

The application supports both light and dark modes. Toggle between them using the sun/moon icon in the header.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Apple Design System for inspiration
- Chart.js for the charting library
- Tailwind CSS for the utility-first CSS framework
- OpenAI for the AI analysis capabilities
