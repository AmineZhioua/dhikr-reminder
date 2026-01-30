import * as vscode from 'vscode';
import { Category } from './adhkar';

export class CategoryManager {    

    constructor(private context: vscode.ExtensionContext) {
        //
    }
    
    // Show category selection on startup
    public async promptCategoryOnStartup(): Promise<Category | null> {
        const config = vscode.workspace.getConfiguration('dhikr-reminder');
        const autoPrompt = config.get<boolean>('autoPrompt', true);
        
        if(!autoPrompt) {
            const defaultCategory = config.get<Category>('defaultCategory', 'Morning Dhikr');
            return this.setSelectedCategory(defaultCategory);
        }
        
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
            placeHolder: 'Choose your daily wisdom category',
            title: '💭 WisdomPop - Select Your Vibe',
            ignoreFocusOut: true
        });
        
        if (!selection) {
            return null; // User cancelled
        }
        
        const category = selection.category as Category;

        await this.setSelectedCategory(category);
        
        return category;
    }
    
    // Get currently selected category
    public getSelectedCategory(): Category {
        const config = vscode.workspace.getConfiguration('wisdompop');
        const rememberChoice = config.get<boolean>('rememberChoice', true);
        
        return config.get<Category>('defaultCategory', 'Morning Dhikr');
    }
    
    // Set selected category
    private async setSelectedCategory(category: Category): Promise<void> {
        const config = vscode.workspace.getConfiguration('dhikr-reminder');
        const rememberChoice = config.get<boolean>('rememberChoice', true);
        
        // Update status bar if exists
        this.updateStatusBar(category);
    }
    
    // Update status bar with current category
    private updateStatusBar(category: Category): void {
        // This could be implemented if you want a status bar indicator
    }
    
    // Open settings
    private openSettings(): void {
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:your-publisher.wisdompop');
    }
}