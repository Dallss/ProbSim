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

## Implementation Details

### Random Number Generation (LCG)
ProbSim uses a **Linear Congruential Generator (LCG)** for reproducible random number generation:

```javascript
class SeededRandom {
  constructor(seed) {
    this.seed = seed
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }
}
```

**LCG Parameters:**
- **Multiplier (a)**: 9301
- **Increment (c)**: 49297  
- **Modulus (m)**: 233280
- **Period**: 233,280 (sufficient for most sampling applications)

This implementation ensures that:
- Given the same seed, identical sequences of random numbers are generated
- Results are reproducible across different sessions
- The generator has good statistical properties for sampling applications

### Sampling Method Implementations

#### 1. Simple Random Sampling (SRS)
```javascript
export function simpleRandomSampling(data, sampleSize, seed) {
  const random = new SeededRandom(seed)
  const shuffled = shuffle(data, random)
  return shuffled.slice(0, sampleSize)
}
```
**Algorithm**: Fisher-Yates shuffle with seeded random number generation
- **Time Complexity**: O(n) where n is population size
- **Space Complexity**: O(n) for shuffled copy
- **Features**: Equal probability selection, unbiased sampling

#### 2. Systematic Sampling
```javascript
export function systematicSampling(data, sampleSize, stepSize = null, seed) {
  const random = new SeededRandom(seed)
  const N = data.length
  const n = sampleSize
  
  // Calculate step size if not provided
  const k = stepSize || Math.floor(N / n)
  
  // Random start point
  const startIndex = Math.floor(random.next() * k)
  
  const selected = []
  for (let i = 0; i < n; i++) {
    const index = (startIndex + i * k) % N // wrap-around
    selected.push(data[index])
  }
  
  return selected
}
```
**Algorithm**: Fixed interval selection with random starting point
- **Time Complexity**: O(n) where n is sample size
- **Space Complexity**: O(n) for selected items
- **Features**: Even distribution, efficient for large populations
- **Step Size**: Automatically calculated as ⌊N/n⌋ or user-specified

#### 3. Stratified Sampling
```javascript
export function stratifiedSampling(data, sampleSize, strataColumn, allocationType, seed) {
  // Supports two allocation strategies:
  // 1. Proportional: Sample size proportional to stratum size
  // 2. Equal: Equal sample size from each stratum
}
```
**Algorithm**: Stratum-based sampling with configurable allocation
- **Time Complexity**: O(N + n) where N is population size, n is sample size
- **Space Complexity**: O(N) for stratum grouping
- **Allocation Types**:
  - **Proportional**: Sample size ∝ stratum size
  - **Equal**: Equal samples per stratum
- **Features**: Maintains stratum representation, handles rounding edge cases

#### 4. Cluster Sampling
```javascript
export function clusterSampling(data, sampleSize, clusterColumn, seed) {
  // Groups data by clusters, selects clusters until sample size is met
}
```
**Algorithm**: Cluster-based selection with sequential inclusion
- **Time Complexity**: O(N) for clustering + O(C) for cluster selection
- **Space Complexity**: O(N) for cluster grouping
- **Features**: Natural grouping preservation, efficient for clustered data
- **Selection**: Sequential cluster selection until sample size is reached

#### 5. Multi-stage Sampling
```javascript
export function multiStageSampling(data, sampleSize, strataColumn, clusterColumn, allocationType, seed) {
  // Stage 1: Stratified sampling of clusters
  // Stage 2: Simple random sampling within selected clusters
}
```
**Algorithm**: Two-stage hierarchical sampling
- **Stage 1**: Stratified selection of clusters (30% of total clusters)
- **Stage 2**: Simple random sampling within selected clusters
- **Time Complexity**: O(N + C + n) where C is number of clusters
- **Space Complexity**: O(N) for cluster and stratum grouping
- **Features**: Combines benefits of both stratified and simple random sampling

### Utility Functions

#### Fisher-Yates Shuffle
```javascript
function shuffle(array, random) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random.next() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
```
**Algorithm**: Modern Fisher-Yates shuffle with seeded random
- **Time Complexity**: O(n) where n is array length
- **Space Complexity**: O(n) for shuffled copy
- **Features**: Unbiased shuffling, reproducible results

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

## Tech Stack
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

## Performance Characteristics

| Method | Time Complexity | Space Complexity | Best Use Case |
|--------|----------------|------------------|---------------|
| SRS | O(n) | O(n) | General purpose, small to medium datasets |
| Systematic | O(n) | O(n) | Large datasets, even distribution needed |
| Stratified | O(N + n) | O(N) | Heterogeneous populations, representation important |
| Cluster | O(N) | O(N) | Naturally clustered data, cost efficiency |
| Multi-stage | O(N + C + n) | O(N) | Complex hierarchical structures |

Where:
- **N** = Population size
- **n** = Sample size  
- **C** = Number of clusters

## Mathematical Foundations

### LCG Properties
- **Period**: 233,280 (sufficient for most applications)
- **Quality**: Good statistical properties for sampling
- **Reproducibility**: Deterministic given seed value

### Sampling Theory
- **Unbiased Selection**: All methods maintain equal probability within their constraints
- **Stratification**: Maintains population structure representation
- **Cluster Efficiency**: Reduces sampling costs for grouped data

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**ProbSim** - Making probabilistic sampling accessible, interactive, and educational through robust implementations and reproducible results.
