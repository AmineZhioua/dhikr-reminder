import * as vscode from 'vscode';
import { Category } from './adhkar';

export class CategoryManager {    

    constructor(private context: vscode.ExtensionContext) {
        //
    }
    
    // Show category selection on startup
    public async promptCategoryOnStartup(): Promise<Category | null> {
        const config = vscode.workspace.getConfiguration('dhikr-reminder');
        
        return this.showCategorySelection();
    }
    
    // Show interactive category selection
    public async showCategorySelection(): Promise<Category | null> {
        const categories = [
            {
                label: '$(lightbulb) Morning Dhikr',
                description: 'Adhkar for morning remembrance',
                detail: 'Remembrances and supplications for the morning time (from Fajr until sunrise/noon)',
                category: 'Morning Dhikr' as Category
            },
            {
                label: '$(watch) Evening Dhikr',
                description: 'Adhkar for evening remembrance',
                detail: 'Remembrances and supplications for the evening time (from Asr until Maghrib/until night)',
                category: 'Evening Dhikr' as Category
            },
            {
                label: '$(pray) After Salah',
                description: 'Adhkar after each prayer',
                detail: 'Remembrances and supplications to be recited after the five daily prayers',
                category: 'After Salah' as Category
            },
            {
                label: '$(moon) Before Sleep',
                description: 'Adhkar before sleeping',
                detail: 'Remembrances and supplications to recite before going to bed',
                category: 'Before Sleep' as Category
            },
            {
                label: '$(sun) Waking Up',
                description: 'Adhkar upon waking up',
                detail: 'Remembrances and supplications to recite when waking up from sleep',
                category: 'Waking Up' as Category
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