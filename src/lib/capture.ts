import { toPng } from 'html-to-image';

export const captureMap = async () => {
    const element = document.getElementById('mindmap-container');
    if (!element) {
        throw new Error('Map element not found');
    }

    try {
        const dataUrl = await toPng(element, {
            quality: 0.95,
            backgroundColor: 'white'
        });

        return dataUrl;
    } catch (error) {
        console.error('Error capturing map:', error);
        throw error;
    }
};
