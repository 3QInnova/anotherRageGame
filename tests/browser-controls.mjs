// Navigate the actual tabbed pause menus in either presentation.
export async function openPauseTab(page,tab='play'){
 if(await page.locator('#campaignMenu').isVisible())await page.locator('#campaignClose').click();
 const desktop=await page.locator('#desktopPause').count();
 if(desktop){if(!(await page.locator('#desktopMenu').isVisible()))await page.locator('#desktopPause').click();await page.locator('#desktopTab-'+tab).click()}
 else{if(!(await page.locator('#mobileMenu').isVisible()))await page.locator('#mobilePause').click();await page.locator('#tab-'+tab).click()}
}
export async function openModeMenu(page,selector='#openDataCenters'){
 if(selector==='#openDataCenters'&&await page.locator('#campaignMenu').isVisible())return;
 await openPauseTab(page,'play');await page.locator(selector).click();
}
export async function openPracticeControls(page){
 await openPauseTab(page,'play');
 await page.locator((await page.locator('#desktopPause').count())?'#desktopPractice':'#openPractice').click();
}
