# ProbSim Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
probsim/
├── src/
│   ├── components/          # React components
│   │   ├── MethodSelection.jsx    # Step 1: Choose sampling method
│   │   ├── DataInput.jsx          # Step 2: Input data
│   │   ├── Parameters.jsx         # Step 3: Set parameters
│   │   ├── Results.jsx            # Step 4: View results
│   │   └── StepIndicator.jsx      # Progress indicator
│   ├── utils/
│   │   └── samplingMethods.js     # Core sampling algorithms
│   ├── App.jsx                    # Main application
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Styles
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── README.md                      # Comprehensive documentation
└── test.html                      # Component test page
```

## 🧪 Testing

### Test Components Visually
Open `test.html` in your browser to see component layouts

### Test Sampling Methods
```bash
npm run demo
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run demo` - Test sampling methods

## 🌐 Features Implemented

✅ **All 5 Sampling Methods**
- Simple Random Sampling (SRS)
- Systematic Sampling
- Stratified Sampling
- Cluster Sampling
- Multi-stage Sampling

✅ **Data Input Options**
- CSV file upload
- Manual data entry
- Built-in example dataset

✅ **Advanced Features**
- Reproducible random seeds
- Sample size as count or percentage
- Color-coded visualizations
- CSV export
- Print to PDF
- Mobile responsive design

✅ **Technical Stack**
- React 18 with hooks
- Vite for fast development
- Tailwind CSS for styling
- Papaparse for CSV handling
- FileSaver.js for downloads

## 🎯 Next Steps

1. **Test the Application**: Open `http://localhost:3000`
2. **Try Example Dataset**: Click "Use Example Dataset" in Step 2
3. **Experiment with Methods**: Try different sampling methods
4. **Customize**: Modify colors, add new methods, or adjust styling

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Dependencies Issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**
```bash
npm run lint
# Fix any ESLint errors
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**ProbSim is ready to use!** 🎉
