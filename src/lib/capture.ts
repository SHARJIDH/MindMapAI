import { toPng } from 'html-to-image';

export const captureMap = async (elementId: string): Promise<Buffer> => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('Map element not found');
    }

    try {
        // Convert the element to a PNG data URL
        const dataUrl = await toPng(element, {
            quality: 0.95,
            backgroundColor: 'white'
        });

        // Convert data URL to Buffer
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        return Buffer.from(base64Data, 'base64');
    } catch (error) {
        console.error('Error capturing map:', error);
        throw error;
    }
};
