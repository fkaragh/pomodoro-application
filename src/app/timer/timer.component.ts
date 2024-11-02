import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TimeSettingsService } from '../settings/time-settings.service';
import { PopupMessageComponent } from '../shared/components/popup/popup-message.component';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgIf, RouterOutlet, NgFor, PopupMessageComponent],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit {
  // Dynamic dot count size for pomodoro
  @HostBinding('style.--dot-count')
  get dotCount() {
    return this.pomodoroCount;
  }

  private timeSettingsService = inject(TimeSettingsService);

  private audio: HTMLAudioElement = new Audio('assets/audio/alarm.mp3');

  timeSettings = this.timeSettingsService.getTimeSettings();
  focusTime = this.timeSettings.focusTime * 60;
  shortBreakTime = this.timeSettings.shortBreakTime * 60;
  longBreakTime = this.timeSettings.longBreakTime * 60;
  pomodoroCount = this.timeSettings.longBreakAfter;

  isAutoFocusOn = this.timeSettings.isAutoFocusOn;
  isAutoBreakOn = this.timeSettings.isAutoBreakOn;
  isAlarmSoundOn = this.timeSettings.isAlarmSoundOn;

  currentPomodoro: number = 0;
  currentTimer: number; //timer in seconds
  totalSeconds: number;

  interval: any;
  //daire hesabi
  radius: number = this.calculateRadius();
  circumference: number;
  strokeDashoffset: number;

  //State variables
  isOnBreak: boolean = false;
  isPaused: boolean = true;
  isBreak: boolean = false;
  isStarted: boolean = false;
  isCounting: boolean = false;
  isLongBreak: boolean = false;
  resetFlag: boolean = false; // Reset flag for the app, if true, reset all sessions button show-up
  isResetConfirmationOpen: boolean = false;
  isSettingsOn:boolean = false;
  isCongratsOpen: boolean = false;

  constructor(private router: Router) {
    this.circumference = 2 * Math.PI * this.radius;
    this.strokeDashoffset = this.circumference;
    this.totalSeconds = this.focusTime; // Initial timer is focus time
    this.currentTimer = this.focusTime;
  }

  ngOnInit(): void {
    this.loadSettings();
  }
  
  private playAlarmSound():void {
    this.audio.currentTime = 0;
    this.audio.play();

  }

  handleCongratsConfirm() {
    this.isCongratsOpen = false;
  }

  loadSettings(): void {
    //burda da yukarda da yukledigimiz icin burasi da biraz mantiksiz olabilir, bakacam sonra
    const settings = this.timeSettingsService.getTimeSettings();
    this.focusTime = settings.focusTime * 60;
    this.shortBreakTime = settings.shortBreakTime * 60;
    this.longBreakTime = settings.longBreakTime * 60;
    this.pomodoroCount = settings.longBreakAfter;
  }


  autoStartTimer(): void {
    if (this.isAutoFocusOn && !this.isOnBreak) {
      console.log('Starting timer for focus session.');
      this.continueTimer();
    } else if (this.isAutoBreakOn && this.isOnBreak) {
      console.log('Starting timer for break session.');
      this.continueTimer();
    }
  }

  calculateRadius(): number {
    //ekran girisinin %66 sini al
    const vw = window.innerWidth * 0.66;
    return vw / 2;
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  updateTime() {
    if (this.totalSeconds > 0) {
      this.totalSeconds--;
      this.setProgress((this.currentTimer - this.totalSeconds) / this.currentTimer);
    } else {
      clearInterval(this.interval);
      this.totalSeconds = 0;
      if (this.isAlarmSoundOn) {
        this.playAlarmSound();
      }
      this.switchMode();// Switch between focus and break
    }
  }

  setProgress(percentage: number) {
    const offset = this.circumference - (percentage * this.circumference);
    this.strokeDashoffset = offset;
  }

  //BUTTONS FUNCTIONS

  skipBreak() {
    this.switchMode();
  }

  resetApp() {
    this.isResetConfirmationOpen = true;
  }

  // handlers for confirm/cancel
  handleResetConfirm() {
    // Original reset logic
    this.resetFlag = false;
    this.currentPomodoro = 0;
    this.totalSeconds = this.focusTime;
    this.currentTimer = this.focusTime;
    this.setProgress(0);
    this.isPaused = true;
    this.isBreak = false;
    this.isOnBreak = false;
    this.isStarted = false;
    this.isCounting = false;
    
    this.isResetConfirmationOpen = false;// Reset confirmation pop-up'ı kapat
  }

  handleResetCancel() {
    this.isResetConfirmationOpen = false;
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.isPaused = !this.isPaused;
    this.isCounting = !this.isCounting;
  }

  continueTimer() {
    this.resetFlag = false;
    this.isStarted = true;
    this.interval = setInterval(() => this.updateTime(), 1000);
    this.isCounting = true;
    this.isPaused = !this.isPaused;
  }

  resetTimer() {
    clearInterval(this.interval);
    if (this.currentPomodoro !== 0) {
      this.totalSeconds = this.focusTime;
    } else if (this.currentPomodoro === 0 && this.isBreak) {
      this.totalSeconds = this.longBreakTime;
    }
    this.resetFlag = true;
    this.setProgress(0);
    this.isPaused = true;
    this.isBreak = false;
    this.isOnBreak = false;
    this.isStarted = false;
    this.isCounting = false;
    this.currentTimer = this.focusTime;
  }

  switchMode() {
    if (this.isBreak || this.isLongBreak) {
      this.isBreak = false;
      this.isLongBreak = false;
      this.isOnBreak = false;
      this.currentTimer = this.focusTime;
      if(this.currentPomodoro % this.pomodoroCount === 0){
        this.currentPomodoro = 0;
        this.isCongratsOpen = true;
      }
    } else {
      if (!this.isOnBreak) {
        this.currentPomodoro++;
      }
      if (!this.isLongBreak && (this.currentPomodoro % this.pomodoroCount === 0)) {
        //guncellendi eski kodlar yorum satiri , silinmesi gerekiyor
        this.currentTimer = this.longBreakTime;
        this.isOnBreak = true;
        this.isLongBreak = true;
        this.isCongratsOpen = true;
        
      } else if (!this.isOnBreak) {
        this.currentTimer = this.shortBreakTime;
        this.isBreak = true;
        this.isOnBreak = true;
      } else {
        this.currentTimer = this.focusTime;
        this.isBreak = false;
        this.isOnBreak = false;
      }
    }
    this.totalSeconds = this.currentTimer;
    this.setProgress(0);
    clearInterval(this.interval);
    this.isPaused = true;
    this.isCounting = false;
    this.isStarted = false;
    this.autoStartTimer(); // Checks for automatic start
  }

  //Routing

  navigateToSettings() {
    this.isSettingsOn = true;
    this.router.navigate(['/settings']);
  }
  
   // Dinamik nokta gösterimi için getter
   get pomodoroPoints() {
    return new Array(this.pomodoroCount).fill(null);
  }

}
