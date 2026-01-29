import * as vscode from 'vscode';
import { Category } from './adhkar';

export class CategoryManager {
    private static readonly GLOBAL_STATE_KEY = 'wisdompop_selected_category';
    
    constructor(private context: vscode.ExtensionContext) {}
    
    // Show category selection on startup
    public async promptCategoryOnStartup(): Promise<Category | null> {
        const config = vscode.workspace.getConfiguration('dhikr-reminder');
        const autoPrompt = config.get<boolean>('autoPrompt', true);
        
        if(!autoPrompt) {
            const defaultCategory = config.get<Category>('defaultCategory', 'wise');
            return this.setSelectedCategory(defaultCategory);
        }
        
        return this.showCategorySelection();
    }
    
    // Show interactive category selection
    public async showCategorySelection(): Promise<Category | null> {
        const categories = [
            {
                label: '$(lightbulb) Wise & Inspirational',
                description: 'Thoughtful quotes for motivation',
                detail: 'Programming wisdom, life lessons, and inspirational thoughts',
                category: 'wise' as Category
            },
            {
                label: '$(smiley) Fun & Humorous',
                description: 'Lighthearted programming jokes',
                detail: 'Developer humor, funny quotes, and programming jokes',
                category: 'fun' as Category
            },
            {
                label: '$(zap) Stupid & Random',
                description: 'Silly, random, and absurd quotes',
                detail: 'Dumb humor, procrastination quotes, and silly thoughts',
                category: 'stupid' as Category
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
        
        // Show confirmation
        vscode.window.showInformationMessage(
            `Selected category: ${category.charAt(0).toUpperCase() + category.slice(1)}`,
            'Show First Quote'
        ).then(choice => {
            if (choice === 'Show First Quote') {
                vscode.commands.executeCommand('dhikr-reminder.showDhikr');
            }
        });
        
        return category;
    }
    
    // Get currently selected category
    public getSelectedCategory(): Category {
        const config = vscode.workspace.getConfiguration('wisdompop');
        const rememberChoice = config.get<boolean>('rememberChoice', true);
        
        if (rememberChoice) {
            const storedCategory = this.context.globalState.get<Category>(
                CategoryManager.GLOBAL_STATE_KEY
            );
            if (storedCategory) {
                return storedCategory;
            }
        }
        
        return config.get<Category>('defaultCategory', 'wise');
    }
    
    // Set selected category
    private async setSelectedCategory(category: Category): Promise<void> {
        const config = vscode.workspace.getConfiguration('dhikr-reminder');
        const rememberChoice = config.get<boolean>('rememberChoice', true);
        
        if(rememberChoice) {
            await this.context.globalState.update(
                CategoryManager.GLOBAL_STATE_KEY,
                category
            );
        }
        
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
    
    // Get category emoji
    public getCategoryEmoji(category: Category): string {
        switch (category) {
            case 'wise': return '💡';
            case 'fun': return '😂';
            case 'stupid': return '🤪';
            default: return '✨';
        }
    }
    
    // Get category display name
    public getCategoryDisplayName(category: Category): string {
        switch (category) {
            case 'wise': return 'Wise & Inspirational';
            case 'fun': return 'Fun & Humorous';
            case 'stupid': return 'Stupid & Random';
            default: return 'Unknown';
        }
    }
}