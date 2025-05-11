<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LeadResource\Pages;
use App\Filament\Resources\LeadResource\RelationManagers;
use App\Models\Lead;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;

    protected static ?string $navigationIcon = 'tabler-address-book';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('business_name')
                            ->required()
                            ->maxLength(255),
                        
                        Forms\Components\TextInput::make('reg_type')
                            ->maxLength(4),
                        
                        Forms\Components\TextInput::make('registration_number')
                            ->maxLength(255),
                            
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->maxLength(255),
                            
                        Forms\Components\TextInput::make('phone_number')
                            ->tel()
                            ->maxLength(255),
                            
                        Forms\Components\TextInput::make('website')
                            ->url()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('facebook')
                            ->label("Facebook name")
                            ->maxLength(255),

                        Forms\Components\TextInput::make('linkedin')
                            ->label("LinkedIn name")
                            ->maxLength(255),

                        Forms\Components\TextInput::make('instagram')
                            ->label("Instagram handle")
                            ->maxLength(255),

                        Forms\Components\TextInput::make('twitter')
                            ->label("Twitter handle")
                            ->maxLength(255),

                    ])->columns(2),
                
                Forms\Components\Section::make('Location')
                    ->schema([
                        Forms\Components\TextInput::make('address')
                            ->maxLength(255),
                            
                        Forms\Components\TextInput::make('city')
                            ->maxLength(255),
                            
                        Forms\Components\Select::make('country')
                            ->options([
                                'latvia' => 'Latvia',
                                'lithuania' => 'Lithuania',
                                'estonia' => 'Estonia',
                            ])
                            ->searchable()
                            ->placeholder('Select a country')
                            ->preload(),
                    ])->columns(3),
                
                Forms\Components\Section::make('Business Details')
                    ->schema([
                        Forms\Components\TextInput::make('industry')
                            ->maxLength(255),

                        Forms\Components\Select::make('employee_count')
                            ->options([
                                '1-10' => '1-10',
                                '11-50' => '11-50',
                                '51-100' => '51-100',
                                '100+' => '100+',
                            ]),
                            
                        Forms\Components\Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                            
                        Forms\Components\Toggle::make('profitable')
                            ->label('Profitable')
                            ->helperText('Does this business operate with profits?')
                            ->onIcon('tabler-currency-dollar')
                            ->offIcon('tabler-x'),
                            
                            
                        Forms\Components\DatePicker::make('founded_date'),
                    ])->columns(2),
                    
                Forms\Components\Section::make('Lead Information')
                    ->schema([
                        Forms\Components\Select::make('source')
                            ->options([
                                'firmas.lv' => 'Firmas.lv',
                                'lursoft.lv' => 'Lursoft.lv',
                                'manual' => 'Manual Entry',
                                'government' => 'Government Sources',
                                'scrape' => 'Web Scraping',
                                'referral' => 'Referral',
                                'other' => 'Other',
                            ])
                            ->default('manual')
                            ->visible(fn ($livewire) => $livewire instanceof \App\Filament\Resources\LeadResource\Pages\EditLead)
                            ->dehydrated(function ($livewire) {
                                // Always include the source in the data, even if hidden
                                return true;
                            })
                            ->afterStateHydrated(function ($component, $state) {
                                // If there's no source specified, set it to manual
                                if (empty($state)) {
                                    $component->state('manual');
                                }
                            }),
                            
                        Forms\Components\TextInput::make('confidence_score')
                            ->label('Confidence Score (%)'),
                            
                        Forms\Components\DateTimePicker::make('last_verified_at')
                            ->label('Last Verified At'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('business_name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('reg_type')
                    ->searchable()
                    ->sortable(),
                    
                Tables\Columns\TextColumn::make('registration_number')
                    ->searchable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('phone_number')
                    ->searchable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('city')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('country')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('industry')
                    ->searchable()
                    ->sortable(),
                    
                Tables\Columns\IconColumn::make('profitable')
                    ->boolean()
                    ->trueIcon('tabler-currency-dollar')
                    ->falseIcon('tabler-x')
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('size_category')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'small' => 'gray',
                        'medium' => 'warning',
                        'large' => 'success',
                        default => 'gray',
                    })
                    ->sortable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('source')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('confidence_score')
                    ->suffix('%')
                    ->sortable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('last_verified_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLeads::route('/'),
            'create' => Pages\CreateLead::route('/create'),
            'edit' => Pages\EditLead::route('/{record}/edit'),
        ];
    }
}
