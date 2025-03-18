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

# ServiceNow AI Assistant

A modern AI-powered assistant for ServiceNow incident analytics, providing conversational insights and comprehensive data analysis.

![ServiceNow AI Assistant Screenshot](screenshots/servicenow-ai-assistant.png)

## Features

- **AI-Powered Floating Assistant**: Ask questions about ServiceNow incidents and get contextual responses
- **Comprehensive Data Analysis**: Get in-depth AI analysis of incident trends, categories, priorities, and more
- **Interactive Chat Interface**: Conversational UI for exploring incident data
- **ServiceNow Insights**: Specialized responses for ServiceNow-specific queries
- **Responsive Design**: Works on desktop and mobile devices

## Key Components

### 1. ServiceNow AI Assistant

A floating button that expands to provide:
- Quick access to AI-powered data analysis
- Chat interface for asking questions about ServiceNow data
- Context-aware responses based on current data filters

### 2. ServiceNow AI Analysis

Comprehensive AI analysis of ServiceNow incident data including:
- Key insights and metrics
- Trend analysis
- Priority and category distribution
- SLA compliance
- Predictive analysis
- Recommendations for improvement

## Usage

### Asking Questions

Click the AI Assistant button in the bottom right corner of the ServiceNow Trends page. You can ask questions such as:

- "Show me incident trends over the last month"
- "What's our SLA performance?"
- "What are the most common incident types?"
- "Show me critical incidents"
- "What's our average resolution time?"

### Getting AI Analysis

Click the "Analyze All Data" button to get a comprehensive AI-driven analysis of your ServiceNow incident data.

## Implementation

The ServiceNow AI Assistant is built with React and integrates with your existing ServiceNow incident data. Key components include:

- `ServiceNowAIAssistant.js`: The main assistant component with chat interface
- `ServiceNowAIAnalysisModal.js`: The analysis modal for comprehensive insights
- Custom animations for a smooth user experience

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:3000`

## License

MIT

## Acknowledgements

This project uses various open-source libraries including React, Recharts, Lucide Icons, and more.

# ServiceNow Incident Analysis Dashboard

An interactive dashboard for analyzing ServiceNow incident data with an AI-powered assistant that can answer queries about incidents, trends, and patterns.

## Live Demo

The application is deployed at [https://saurabhdsh.github.io/ciai/](https://saurabhdsh.github.io/ciai/)

## Features

- Interactive dashboard for ServiceNow incident analytics
- AI Assistant that can answer questions about incidents
- Category and date range filtering
- Trend analysis and visualizations
- Dark mode support
- Mobile-responsive design

## AI Assistant Capabilities

The AI Assistant can answer questions like:
- "How many open incidents do we have?"
- "How many incidents were in January 2025?"
- "How many open critical incidents in January 2025?"
- "How many incidents are related to Network?"
- "Show me the top 3 critical incidents"

## Local Development

1. Clone the repository:
   ```
   git clone https://github.com/saurabhdsh/ciai.git
   cd ciai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will be available at [http://localhost:3000](http://localhost:3000)

## Deployment to GitHub Pages

The project is configured to deploy automatically to GitHub Pages when changes are pushed to the main branch. The deployment is handled by GitHub Actions.

To deploy manually:

1. Update the homepage field in package.json if needed:
   ```json
   "homepage": "https://saurabhdsh.github.io/ciai"
   ```

2. Run the deploy command:
   ```
   npm run deploy
   ```

3. The application will be deployed to the gh-pages branch and accessible at the homepage URL.

## Project Structure

- `src/components/` - Reusable React components
- `src/pages/` - Page-level components
- `src/styles/` - CSS and styling files
- `public/data/` - CSV data files for incidents

## Technology Stack

- React
- Ant Design
- Recharts for data visualization
- date-fns for date handling
- PapaParse for CSV parsing
