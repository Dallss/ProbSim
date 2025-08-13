# ProbSim - Probabilistic Sampling Methods Simulator

A comprehensive, frontend-only web application for simulating various probabilistic sampling methods. Built with React, Vite, and Tailwind CSS, ProbSim provides an intuitive interface for understanding and practicing different sampling techniques used in statistics and research.

## Features

### Sampling Methods
- **Simple Random Sampling (SRS)**: Each item has an equal probability of selection
- **Systematic Sampling**: Select items at regular intervals from a sorted list
- **Stratified Sampling**: Divide population into strata with proportional or equal allocation
- **Cluster Sampling**: Select clusters and include all items within selected clusters
- **Multi-stage Sampling**: Two-stage approach combining stratified and simple random sampling

### Data Input Options
- **CSV Upload**: Drag and drop or click to upload CSV files
- **Manual Input**: Paste data in JSON or CSV format
- **Example Dataset**: Built-in 20-record demographic dataset for immediate testing

### Advanced Features
- **Reproducible Results**: Configurable random seed for consistent sampling
- **Flexible Sample Sizing**: Set sample size as count or percentage
- **Visual Results**: Color-coded strata and clusters with fade-in animations
- **Export Options**: Download results as CSV or print to PDF
- **Mobile Responsive**: Optimized for all device sizes

## Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd probsim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```
### Tech Stack
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for responsive design

### Key Libraries
- **Papaparse**: Robust CSV parsing and handling
- **FileSaver.js**: Client-side file download functionality

### Project Structure
```
src/
├── components/          # React components
│   ├── MethodSelection.jsx
│   ├── DataInput.jsx
│   ├── Parameters.jsx
│   ├── Results.jsx
│   └── StepIndicator.jsx
├── utils/              # Utility functions
│   └── samplingMethods.js
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

### Data Format Requirements
- **Minimum**: 1 column, 2+ rows
- **Supported**: CSV with headers, JSON array of objects
- **Columns**: Any number of columns with mixed data types

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+


## License

This project is licensed under the MIT License - see the LICENSE file for details.


---

**ProbSim** - Making probabilistic sampling accessible, interactive, and educational.
