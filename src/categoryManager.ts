import * as vscode from 'vscode';
import { Category } from './adhkar';

export class CategoryManager {    

    constructor(private context: vscode.ExtensionContext) {
        //
    }

    
    // Show interactive category selection
    public async showCategorySelection(): Promise<Category | null> {
        const categories = [
            {
                label: 'Morning Dhikr',
                description: 'Adhkar for morning remembrance',
                detail: 'Remembrances and supplications for the morning time (from Fajr until sunrise/noon)',
                category: 'Morning Dhikr' as Category
            },
            {
                label: 'Evening Dhikr',
                description: 'Adhkar for evening remembrance',
                detail: 'Remembrances and supplications for the evening time (from Asr until Maghrib/until night)',
                category: 'Evening Dhikr' as Category
            },
            {
                label: 'After Salah',
                description: 'Adhkar after each prayer',
                detail: 'Remembrances and supplications to be recited after the five daily prayers',
                category: 'After Salah' as Category
            },
            {
                label: 'Before Sleep',
                description: 'Adhkar before sleeping',
                detail: 'Remembrances and supplications to recite before going to bed',
                category: 'Before Sleep' as Category
            },
            {
                label: 'Waking Up',
                description: 'Adhkar upon waking up',
                detail: 'Remembrances and supplications to recite when waking up from sleep',
                category: 'Waking Up' as Category
            },
            {
                label: 'Muhammad BPUH Duaa\'s',
                description: 'Duaa\'s from our prophet Muhammad PBUH',
                detail: 'Duaa\'s that our beloved prophet Muhammad PBUH used to say',
                category: 'Muhammad BPUH Duaa\'s' as Category
            },
            {
                label: 'Quranic Duaa\'s',
                description: 'Duaa\'s from the Quran',
                detail: 'Duaa\'s that was extracted from the Quran',
                category: 'Quranic Duaa\'s' as Category
            },
        ];
        
        const selection = await vscode.window.showQuickPick(categories, {
            placeHolder: 'Choose your Dhikr category',
            title: 'Dhikr Reminder Extension',
            ignoreFocusOut: true
        });
        
        if (!selection) {
            return null; // User cancelled
        }
        
        const category = selection.category as Category;
        
        return category;
    }
}