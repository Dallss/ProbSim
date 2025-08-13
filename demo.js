// Demo script to test sampling methods
import { performSampling } from './src/utils/samplingMethods.js'

// Sample data
const sampleData = [
  { id: 1, name: 'Alice', age: 25, stratum: 'A' },
  { id: 2, name: 'Bob', age: 30, stratum: 'B' },
  { id: 3, name: 'Carol', age: 35, stratum: 'A' },
  { id: 4, name: 'David', age: 28, stratum: 'C' },
  { id: 5, name: 'Eva', age: 32, stratum: 'B' },
  { id: 6, name: 'Frank', age: 27, stratum: 'A' },
  { id: 7, name: 'Grace', age: 29, stratum: 'C' },
  { id: 8, name: 'Henry', age: 31, stratum: 'B' },
  { id: 9, name: 'Ivy', age: 26, stratum: 'A' },
  { id: 10, name: 'Jack', age: 33, stratum: 'C' }
]

console.log('Testing ProbSim Sampling Methods...')
console.log('Sample data:', sampleData.length, 'records')

// Test Simple Random Sampling
try {
  const srsResult = performSampling(sampleData, 'srs', {
    sampleSize: 3,
    randomSeed: 12345
  })
  console.log('SRS Result:', srsResult.length, 'items selected')
} catch (error) {
  console.error('SRS Error:', error.message)
}

// Test Stratified Sampling
try {
  const stratifiedResult = performSampling(sampleData, 'stratified', {
    sampleSize: 4,
    strataColumn: 'stratum',
    allocationType: 'proportional',
    randomSeed: 12345
  })
  console.log('Stratified Result:', stratifiedResult.length, 'items selected')
} catch (error) {
  console.error('Stratified Error:', error.message)
}

console.log('Demo completed successfully!')
