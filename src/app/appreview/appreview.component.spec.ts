import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppreviewComponent } from "./appreview.component";

describe("AppreviewComponent", () => {
	let component: AppreviewComponent;
	let fixture: ComponentFixture<AppreviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AppreviewComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AppreviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
