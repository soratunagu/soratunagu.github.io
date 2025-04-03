document.addEventListener("DOMContentLoaded", () => {
    // セクションが画面に表示されたらフェードインする
    const sections = document.querySelectorAll("section")
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2, // 20%が画面に表示された時に発動
    }
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    }, options)
  
    sections.forEach((section) => {
      observer.observe(section)
    })
  
    // スムーズスクロール
    const links = document.querySelectorAll("nav ul li a, .fixed-reservation-button a")
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      })
    })
  
    // Hero Carousel
    const carouselSlides = document.querySelectorAll(".carousel-slide")
    const indicators = document.querySelectorAll(".indicator")
    let currentSlideIndex = 0
  
    function showSlide(index) {
      // Hide all slides
      carouselSlides.forEach((slide) => {
        slide.classList.remove("active")
      })
  
      // Remove active class from all indicators
      indicators.forEach((indicator) => {
        indicator.classList.remove("active")
      })
  
      // Show the selected slide and indicator
      carouselSlides[index].classList.add("active")
      indicators[index].classList.add("active")
    }
  
    // Auto rotate slides
    function nextSlide() {
      currentSlideIndex++
      if (currentSlideIndex >= carouselSlides.length) {
        currentSlideIndex = 0
      }
      showSlide(currentSlideIndex)
    }
  
    // Set up indicator clicks
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        currentSlideIndex = index
        showSlide(currentSlideIndex)
      })
    })
  
    // Start the carousel
    const carouselInterval = setInterval(nextSlide, 5000)
  
    // Pause carousel on hover
    const heroSection = document.querySelector(".hero-section")
    if (heroSection) {
      heroSection.addEventListener("mouseenter", () => {
        clearInterval(carouselInterval)
      })
  
      heroSection.addEventListener("mouseleave", () => {
        setInterval(nextSlide, 5000)
      })
    }
  
    // Sticky Header
    const header = document.querySelector(".sticky-header")
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  
    // Mobile Menu
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const body = document.body
  
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => {
        // Create mobile nav if it doesn't exist
        if (!document.querySelector(".mobile-nav")) {
          const mobileNav = document.createElement("div")
          mobileNav.className = "mobile-nav"
  
          const closeBtn = document.createElement("div")
          closeBtn.className = "close-mobile-nav"
          closeBtn.innerHTML = "&times;"
  
          const navItems = document.querySelector("nav ul").cloneNode(true)
  
          mobileNav.appendChild(closeBtn)
          mobileNav.appendChild(navItems)
          body.appendChild(mobileNav)
  
          // Close mobile nav
          closeBtn.addEventListener("click", () => {
            mobileNav.classList.remove("active")
            body.style.overflow = ""
          })
  
          // Handle nav item clicks
          const mobileNavItems = mobileNav.querySelectorAll("a")
          mobileNavItems.forEach((item) => {
            item.addEventListener("click", () => {
              mobileNav.classList.remove("active")
              body.style.overflow = ""
            })
          })
        }
  
        // Toggle mobile nav
        const mobileNav = document.querySelector(".mobile-nav")
        mobileNav.classList.add("active")
        body.style.overflow = "hidden"
      })
    }
  
    // Experience Filters
    const filterBtns = document.querySelectorAll(".filter-btn")
    const experienceCards = document.querySelectorAll(".experience-card")
  
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        filterBtns.forEach((b) => b.classList.remove("active"))
        // Add active class to clicked button
        this.classList.add("active")
  
        const filter = this.getAttribute("data-filter")
  
        experienceCards.forEach((card) => {
          if (filter === "all" || card.getAttribute("data-category") === filter) {
            card.style.display = "block"
            setTimeout(() => {
              card.style.opacity = "1"
              card.style.transform = "translateY(0)"
            }, 10)
          } else {
            card.style.opacity = "0"
            card.style.transform = "translateY(20px)"
            setTimeout(() => {
              card.style.display = "none"
            }, 300)
          }
        })
      })
    })
  
    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
  
      question.addEventListener("click", () => {
        // Close all other items
        faqItems.forEach((i) => {
          if (i !== item) {
            i.classList.remove("active")
          }
        })
  
        // Toggle current item
        item.classList.toggle("active")
      })
    })
  
    // Testimonial Slider
    const testimonialSlider = document.getElementById("testimonialSlider")
    const testimonialSlides = testimonialSlider.querySelectorAll(".testimonial-slide")
    const prevBtn = document.getElementById("prevTestimonial")
    const nextBtn = document.getElementById("nextTestimonial")
    let currentSlide = 0
  
    // Hide all slides except the first one
    testimonialSlides.forEach((slide, index) => {
      if (index !== 0) {
        slide.style.display = "none"
      }
    })
  
    // Show a specific slide
    function showTestimonialSlide(index) {
      // Hide all slides
      testimonialSlides.forEach((slide) => {
        slide.style.display = "none"
      })
  
      // Show the selected slide
      testimonialSlides[index].style.display = "block"
      testimonialSlides[index].classList.add("fade-in")
    }
  
    // Previous slide
    prevBtn.addEventListener("click", () => {
      currentSlide--
      if (currentSlide < 0) {
        currentSlide = testimonialSlides.length - 1
      }
      showTestimonialSlide(currentSlide)
    })
  
    // Next slide
    nextBtn.addEventListener("click", () => {
      currentSlide++
      if (currentSlide >= testimonialSlides.length) {
        currentSlide = 0
      }
      showTestimonialSlide(currentSlide)
    })
  
    // Auto slide
    setInterval(() => {
      nextBtn.click()
    }, 8000)
  
    // Booking Modal
    const bookingModal = document.getElementById("bookingModal")
    const successModal = document.getElementById("successModal")
    const bookNowBtns = document.querySelectorAll(
      ".book-now-btn, #navBookNow, #heroBookNow, #aboutBookNow, #fixedBookNow, #groupBooking",
    )
    const closeModalBtns = document.querySelectorAll(".close-modal, #closeSuccessModal")
    const selectedExperience = document.getElementById("selectedExperience")
    const bookingForm = document.getElementById("bookingForm")
  
    // Open booking modal
    bookNowBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Set the selected experience if available
        if (this.hasAttribute("data-experience")) {
          const experience = this.getAttribute("data-experience")
          selectedExperience.innerHTML = `<p class="selected-experience">Selected Experience: <strong>${experience}</strong></p>`
        } else {
          selectedExperience.innerHTML = ""
        }
  
        // Show the modal
        bookingModal.classList.add("active")
        body.style.overflow = "hidden"
      })
    })
  
    // Close modals
    closeModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        bookingModal.classList.remove("active")
        successModal.classList.remove("active")
        body.style.overflow = ""
      })
    })
  
    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === bookingModal || e.target === successModal) {
        bookingModal.classList.remove("active")
        successModal.classList.remove("active")
        body.style.overflow = ""
      }
    })
  
    // Handle booking form submission
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Here you would normally send the form data to a server
      // For this example, we'll just show the success modal
  
      bookingModal.classList.remove("active")
      successModal.classList.add("active")
  
      // Reset the form
      bookingForm.reset()
    })
  
    // Contact Form Submission
    const contactForm = document.getElementById("contactForm")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Here you would normally send the form data to a server
        // For this example, we'll just show an alert
  
        alert("Thank you for your message! We will get back to you soon.")
  
        // Reset the form
        contactForm.reset()
      })
    }
  
    // Newsletter Form Submission
    const newsletterForm = document.querySelector(".newsletter-form")
  
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Here you would normally send the form data to a server
        // For this example, we'll just show an alert
  
        alert("Thank you for subscribing to our newsletter!")
  
        // Reset the form
        newsletterForm.reset()
      })
    }
  
    // Countdown Timer
    const countdownElement = document.getElementById("countdown-timer")
  
    if (countdownElement) {
      // Set the countdown date (2 days from now)
      const countdownDate = new Date()
      countdownDate.setDate(countdownDate.getDate() + 2)
      countdownDate.setHours(countdownDate.getHours() + 12)
      countdownDate.setMinutes(countdownDate.getMinutes() + 45)
  
      // Update the countdown every second
      const countdownInterval = setInterval(() => {
        // Get the current date and time
        const now = new Date().getTime()
  
        // Calculate the time remaining
        const distance = countdownDate - now
  
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  
        // Display the countdown
        countdownElement.textContent = `${days}d ${hours}h ${minutes}m`
  
        // If the countdown is over, clear the interval
        if (distance < 0) {
          clearInterval(countdownInterval)
          countdownElement.textContent = "Offer expired"
        }
      }, 1000)
    }
  
    // Personalized Recommendations
    const relatedExperiences = document.getElementById("relatedExperiences")
  
    if (relatedExperiences) {
      // In a real application, you would fetch personalized recommendations based on user behavior
      // For this example, we'll just randomize the order of the existing cards
  
      const relatedCards = Array.from(relatedExperiences.querySelectorAll(".related-card"))
  
      // Shuffle the cards
      for (let i = relatedCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        relatedExperiences.appendChild(relatedCards[j])
      }
    }
  
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll(
      ".experience-card, .pricing-card, .gallery-item, .testimonial-content, .faq-item",
    )
  
    const animateElementsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in")
            animateElementsObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )
  
    animateElements.forEach((element) => {
      animateElementsObserver.observe(element)
    })
  
    // Track CTA clicks for analytics
    const ctaButtons = document.querySelectorAll(".cta-button")
  
    ctaButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // In a real application, you would send this data to your analytics service
        console.log("CTA clicked:", this.textContent.trim())
      })
    })
  
    // Simulate remaining spots (random numbers between 1-8)
    const spotsLeftElements = document.querySelectorAll(".spots-left")
  
    spotsLeftElements.forEach((element) => {
      const randomSpots = Math.floor(Math.random() * 8) + 1
      element.textContent = `${randomSpots} spots left`
  
      // Add urgency for low spots
      if (randomSpots <= 3) {
        element.style.color = "#ff3b30"
        element.style.fontWeight = "700"
      }
    })
  })
  
  
