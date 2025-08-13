# ProbSim - Probabilistic Sampling Methods Simulator

A comprehensive, frontend-only web application for simulating various probabilistic sampling methods. Built with React, Vite, and Tailwind CSS, ProbSim provides an intuitive interface for understanding and practicing different sampling techniques used in statistics and research.

## 🎯 Features

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

## 🚀 Quick Start

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

## 📖 Usage Guide

### Step 1: Choose Sampling Method
Select from five available sampling methods. Each method includes detailed tooltips explaining the approach and when to use it.

### Step 2: Input Data
- **Example Dataset**: Click to load the built-in dataset (recommended for first-time users)
- **CSV Upload**: Upload your own data file
- **Manual Input**: Paste data directly into the text area

### Step 3: Configure Parameters
- Set sample size (count or percentage)
- Configure method-specific parameters (strata columns, allocation types, etc.)
- Set random seed for reproducible results

### Step 4: View Results
- Examine selected items with color-coded visualizations
- Download results as CSV
- Print results to PDF
- View detailed sampling statistics

## 🏗️ Technical Architecture

### Frontend Stack
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

## 🎨 Design Features

### User Experience
- **Step-by-step Wizard**: Clear progression through the sampling process
- **Visual Feedback**: Progress indicators and status updates
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: Semantic HTML and keyboard navigation support

### Visual Elements
- **Color Coding**: Distinct colors for different strata and clusters
- **Animations**: Smooth fade-in effects for selected items
- **Interactive Tables**: Hover effects and responsive data display
- **Modern UI**: Clean, professional interface with consistent spacing

## 🔧 Customization

### Adding New Sampling Methods
1. Implement the sampling algorithm in `src/utils/samplingMethods.js`
2. Add method details to `SAMPLING_METHODS` array in `MethodSelection.jsx`
3. Update parameter handling in `Parameters.jsx` if needed

### Styling Modifications
- Modify `src/index.css` for custom CSS classes
- Update `tailwind.config.js` for theme customization
- Component-specific styles use Tailwind utility classes

### Data Format Requirements
- **Minimum**: 1 column, 2+ rows
- **Supported**: CSV with headers, JSON array of objects
- **Columns**: Any number of columns with mixed data types

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for educational and research purposes
- Inspired by statistical sampling methods taught in research methodology courses
- Designed to make complex sampling concepts accessible and interactive

## 📞 Support

For questions, issues, or feature requests:
- Create an issue in the GitHub repository
- Check the documentation for common questions
- Review the example dataset for format guidance

---

**ProbSim** - Making probabilistic sampling accessible, interactive, and educational. 🎲📊✨
