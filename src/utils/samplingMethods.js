// Seeded random number generator for reproducibility
class SeededRandom {
  constructor(seed) {
    this.seed = seed
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }
}

// Fisher-Yates shuffle with seeded random
function shuffle(array, random) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random.next() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Simple Random Sampling
export function simpleRandomSampling(data, sampleSize, seed) {
  const random = new SeededRandom(seed)
  const shuffled = shuffle(data, random)
  return shuffled.slice(0, sampleSize)
}

// Systematic Sampling
export function systematicSampling(data, sampleSize, stepSize = null, seed) {
  const random = new SeededRandom(seed)
  const N = data.length
  const n = sampleSize
  
  // Calculate step size if not provided
  const k = stepSize || Math.floor(N / n)
  
  // Random start point
  const startIndex = Math.floor(random.next() * k)
  
  const selected = []
  for (let i = 0; i < n && startIndex + i * k < N; i++) {
    selected.push(data[startIndex + i * k])
  }
  
  return selected
}

// Stratified Sampling
export function stratifiedSampling(data, sampleSize, strataColumn, allocationType, seed) {
  const random = new SeededRandom(seed)
  
  // Group data by strata
  const strata = {}
  data.forEach(item => {
    const stratum = item[strataColumn]
    if (!strata[stratum]) {
      strata[stratum] = []
    }
    strata[stratum].push(item)
  })
  
  const selected = []
  
  if (allocationType === 'proportional') {
    // Proportional allocation
    Object.keys(strata).forEach(stratum => {
      const stratumSize = strata[stratum].length
      const stratumSampleSize = Math.round((stratumSize / data.length) * sampleSize)
      
      if (stratumSampleSize > 0) {
        const shuffled = shuffle(strata[stratum], random)
        selected.push(...shuffled.slice(0, stratumSampleSize))
      }
    })
  } else {
    // Equal allocation
    const strataCount = Object.keys(strata).length
    const samplesPerStratum = Math.floor(sampleSize / strataCount)
    
    Object.keys(strata).forEach(stratum => {
      const shuffled = shuffle(strata[stratum], random)
      selected.push(...shuffled.slice(0, samplesPerStratum))
    })
  }
  
  // If we need more samples due to rounding, add from largest strata
  if (selected.length < sampleSize) {
    const remaining = sampleSize - selected.length
    const sortedStrata = Object.entries(strata)
      .sort(([,a], [,b]) => b.length - a.length)
    
    for (let i = 0; i < remaining && i < sortedStrata.length; i++) {
      const [stratum, items] = sortedStrata[i]
      const alreadySelected = selected.filter(item => item[strataColumn] === stratum)
      const available = items.filter(item => !alreadySelected.includes(item))
      
      if (available.length > 0) {
        const shuffled = shuffle(available, random)
        selected.push(shuffled[0])
      }
    }
  }
  
  return selected.slice(0, sampleSize)
}

// Cluster Sampling
export function clusterSampling(data, sampleSize, clusterColumn, seed) {
  const random = new SeededRandom(seed)
  
  // Group data by clusters
  const clusters = {}
  data.forEach(item => {
    const cluster = item[clusterColumn]
    if (!clusters[cluster]) {
      clusters[cluster] = []
    }
    clusters[cluster].push(item)
  })
  
  const clusterKeys = Object.keys(clusters)
  const shuffledClusters = shuffle(clusterKeys, random)
  
  // Select clusters until we have enough items
  const selected = []
  for (const clusterKey of shuffledClusters) {
    if (selected.length >= sampleSize) break
    selected.push(...clusters[clusterKey])
  }
  
  return selected.slice(0, sampleSize)
}

// Multi-stage Sampling (Stage 1: Stratified, Stage 2: SRS)
export function multiStageSampling(data, sampleSize, strataColumn, clusterColumn, allocationType, seed) {
  const random = new SeededRandom(seed)
  
  // Stage 1: Stratified sampling of clusters
  const clusters = {}
  data.forEach(item => {
    const cluster = item[clusterColumn]
    if (!clusters[cluster]) {
      clusters[cluster] = []
    }
    clusters[cluster].push(item)
  })
  
  // Calculate how many clusters to select
  const totalClusters = Object.keys(clusters).length
  const clustersToSelect = Math.max(1, Math.floor(totalClusters * 0.3)) // Select 30% of clusters
  
  // Stratified selection of clusters
  const clusterStrata = {}
  Object.keys(clusters).forEach(cluster => {
    const stratum = clusters[cluster][0][strataColumn]
    if (!clusterStrata[stratum]) {
      clusterStrata[stratum] = []
    }
    clusterStrata[stratum].push(cluster)
  })
  
  const selectedClusters = []
  if (allocationType === 'proportional') {
    Object.keys(clusterStrata).forEach(stratum => {
      const stratumClusters = clusterStrata[stratum]
      const clustersFromStratum = Math.round((stratumClusters.length / totalClusters) * clustersToSelect)
      const shuffled = shuffle(stratumClusters, random)
      selectedClusters.push(...shuffled.slice(0, clustersFromStratum))
    })
  } else {
    Object.keys(clusterStrata).forEach(stratum => {
      const stratumClusters = clusterStrata[stratum]
      const clustersFromStratum = Math.floor(clustersToSelect / Object.keys(clusterStrata).length)
      const shuffled = shuffle(stratumClusters, random)
      selectedClusters.push(...shuffled.slice(0, clustersFromStratum))
    })
  }
  
  // Stage 2: Simple random sampling within selected clusters
  const itemsFromSelectedClusters = []
  selectedClusters.forEach(clusterKey => {
    itemsFromSelectedClusters.push(...clusters[clusterKey])
  })
  
  return simpleRandomSampling(itemsFromSelectedClusters, sampleSize, seed)
}

// Main sampling function
export function performSampling(data, method, parameters) {
  const { sampleSize, samplePercentage, usePercentage, strataColumn, allocationType, clusterColumn, stepSize, randomSeed } = parameters
  
  // Calculate actual sample size
  let actualSampleSize = sampleSize
  if (usePercentage && samplePercentage) {
    actualSampleSize = Math.round(data.length * (parseFloat(samplePercentage) / 100))
  }
  
  if (!actualSampleSize || actualSampleSize <= 0) {
    throw new Error('Invalid sample size')
  }
  
  // Ensure sample size doesn't exceed population size
  actualSampleSize = Math.min(actualSampleSize, data.length)
  
  switch (method) {
    case 'srs':
      return simpleRandomSampling(data, actualSampleSize, randomSeed)
    
    case 'systematic':
      return systematicSampling(data, actualSampleSize, stepSize, randomSeed)
    
    case 'stratified':
      if (!strataColumn) throw new Error('Strata column is required for stratified sampling')
      return stratifiedSampling(data, actualSampleSize, strataColumn, allocationType, randomSeed)
    
    case 'cluster':
      if (!clusterColumn) throw new Error('Cluster column is required for cluster sampling')
      return clusterSampling(data, actualSampleSize, clusterColumn, randomSeed)
    
    case 'multi-stage':
      if (!strataColumn || !clusterColumn) {
        throw new Error('Both strata and cluster columns are required for multi-stage sampling')
      }
      return multiStageSampling(data, actualSampleSize, strataColumn, clusterColumn, allocationType, randomSeed)
    
    default:
      throw new Error(`Unknown sampling method: ${method}`)
  }
}
