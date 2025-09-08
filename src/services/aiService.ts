import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

// ===================================================================
// PART 1: THE AI SERVICE (using the Singleton Pattern)
// ===================================================================

export class AIService {
  // A private, static property to hold the one and only instance of this class
  private static instance: AIService;

  // A private map to store our loaded AI models so we can easily access them
  private models: Map<string, tf.LayersModel> = new Map();

  // The constructor is private to prevent creating new instances from elsewhere
  private constructor() {}

  // The public method to get the single instance of the class
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Method to load all our AI models from files
  public async loadModels() {
    try {
      console.log('Loading AI models...');
      const sourceModel = await tf.loadLayersModel('/models/contamination-source-model.json');
      this.models.set('sourceDetection', sourceModel);

      const healthModel = await tf.loadLayersModel('/models/health-risk-model.json');
      this.models.set('healthRisk', healthModel);

      const qualityModel = await tf.loadLayersModel('/models/data-quality-model.json');
      this.models.set('dataQuality', qualityModel);
      console.log('AI models loaded successfully!');
    } catch (error) {
      console.error('Failed to load AI models:', error);
    }
  }

  // Method to predict the source of contamination
  public async predictContaminationSource(pollutionData: number[], geoData: number[]): Promise<any> {
    const model = this.models.get('sourceDetection');
    if (!model) throw new Error('Source detection model not loaded');

    // Convert our simple number arrays into a "Tensor", the format TFJS needs
    const inputTensor = tf.tensor2d([ ...pollutionData, ...geoData ], [1, pollutionData.length + geoData.length]);
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const result = await prediction.data();

    // Clean up memory
    inputTensor.dispose();
    prediction.dispose();

    return {
      industrial: result[0],
      agricultural: result[1],
      urban: result[2],
      natural: result[3],
    };
  }

  // Method to assess future health risks
  public async assessHealthRisk(hmpiValue: number, population: number, timeframe: string): Promise<any> {
    const model = this.models.get('healthRisk');
    if (!model) throw new Error('Health risk model not loaded');

    const inputTensor = tf.tensor2d([[hmpiValue, population, this.encodeTimeframe(timeframe)]]);
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const result = await prediction.data();

    inputTensor.dispose();
    prediction.dispose();

    return {
      riskIncrease: result[0],
      confidence: result[1],
      severity: this.categorizeSeverity(result[0]),
    };
  }

  // Method to validate the quality of new data entries
  public async validateDataQuality(readings: number[]): Promise<any> {
    const model = this.models.get('dataQuality');
    if (!model) throw new Error('Data quality model not loaded');

    const inputTensor = tf.tensor2d([readings]);
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const result = await prediction.data();

    inputTensor.dispose();
    prediction.dispose();

    return {
      isValid: result[0] > 0.7,
      confidence: result[0],
      anomalies: this.detectAnomalies(readings, result as Float32Array),
    };
  }

  // Private helper methods used only inside this class
  private encodeTimeframe(timeframe: string): number {
    const mapping: { [key: string]: number } = { '6months': 0.5, '1year': 1.0, '5years': 5.0 };
    return mapping[timeframe] || 1.0;
  }

  private categorizeSeverity(risk: number): string {
    if (risk < 0.2) return 'Low';
    if (risk < 0.5) return 'Moderate';
    if (risk < 0.8) return 'High';
    return 'Critical';
  }

  private detectAnomalies(readings: number[], predictions: Float32Array): string[] {
    const anomalies: string[] = [];
    // In a real app, complex logic would go here to find anomalies.
    return anomalies;
  }
}

// ===================================================================
// PART 2: THE API SERVICE
// ===================================================================
export const apiService = {
  async fetchMonitoringData() {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/monitoring-data`);
    return response.data;
  },

  async submitCitizenReport(report: any) {
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/citizen-reports`, report);
    return response.data;
  },

  async triggerEmergencyAlert(alert: any) {
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/emergency-alerts`, alert);
    return response.data;
  }
};